#include <terrama2/core/Shared.hpp>
#include <terrama2/core/utility/Utils.hpp>
#include <terrama2/core/utility/TimeUtils.hpp>
#include <terrama2/core/utility/TerraMA2Init.hpp>
#include <terrama2/core/utility/ServiceManager.hpp>
#include <terrama2/core/utility/SemanticsManager.hpp>
#include <terrama2/core/data-model/DataProvider.hpp>
#include <terrama2/core/data-model/DataSeries.hpp>
#include <terrama2/core/data-model/DataSet.hpp>
#include <terrama2/core/data-model/DataSetDcp.hpp>

#include <terrama2/services/analysis/core/python/PythonInterpreter.hpp>
#include <terrama2/services/analysis/core/utility/PythonInterpreterInit.hpp>
#include <terrama2/services/analysis/core/Analysis.hpp>
#include <terrama2/services/analysis/core/Service.hpp>
#include <terrama2/services/analysis/core/DataManager.hpp>

#include <terrama2/services/analysis/mock/MockAnalysisLogger.hpp>

#include <terrama2/impl/Utils.hpp>
#include <terrama2/Config.hpp>

#include "UtilsPostGis.hpp"
#include "UtilsDCPSerrmarInpe.hpp"


#include <iostream>

// QT
#include <QTimer>
#include <QCoreApplication>
#include <QUrl>


using namespace terrama2::services::analysis::core;

int main(int argc, char* argv[])
{
  terrama2::core::TerraMA2Init terramaRaii("example", 0);

  terrama2::core::registerFactories();

  {
    terrama2::services::analysis::core::PythonInterpreterInit pythonInterpreterInit;

    QCoreApplication app(argc, argv);

    auto& serviceManager = terrama2::core::ServiceManager::getInstance();

    auto dataManager = std::make_shared<terrama2::services::analysis::core::DataManager>();

    auto loggerCopy = std::make_shared<terrama2::core::MockAnalysisLogger>();

    EXPECT_CALL(*loggerCopy, setConnectionInfo(::testing::_)).WillRepeatedly(::testing::Return());
    EXPECT_CALL(*loggerCopy, setTableName(::testing::_)).WillRepeatedly(::testing::Return());
    EXPECT_CALL(*loggerCopy, getLastProcessTimestamp(::testing::_)).WillRepeatedly(::testing::Return(nullptr));
    EXPECT_CALL(*loggerCopy, getDataLastTimestamp(::testing::_)).WillRepeatedly(::testing::Return(nullptr));
    EXPECT_CALL(*loggerCopy, done(::testing::_, ::testing::_)).WillRepeatedly(::testing::Return());
    EXPECT_CALL(*loggerCopy, start(::testing::_)).WillRepeatedly(::testing::Return(0));
    EXPECT_CALL(*loggerCopy, isValid()).WillRepeatedly(::testing::Return(true));

    auto logger = std::make_shared<terrama2::core::MockAnalysisLogger>();

    EXPECT_CALL(*logger, setConnectionInfo(::testing::_)).WillRepeatedly(::testing::Return());
    EXPECT_CALL(*logger, setTableName(::testing::_)).WillRepeatedly(::testing::Return());
    EXPECT_CALL(*logger, getLastProcessTimestamp(::testing::_)).WillRepeatedly(::testing::Return(nullptr));
    EXPECT_CALL(*logger, getDataLastTimestamp(::testing::_)).WillRepeatedly(::testing::Return(nullptr));
    EXPECT_CALL(*logger, done(::testing::_, ::testing::_)).WillRepeatedly(::testing::Return());
    EXPECT_CALL(*logger, start(::testing::_)).WillRepeatedly(::testing::Return(0));
    EXPECT_CALL(*logger, clone()).WillRepeatedly(::testing::Return(loggerCopy));
    EXPECT_CALL(*logger, isValid()).WillRepeatedly(::testing::Return(true));

    Service service(dataManager);
    serviceManager.setInstanceId(1);
    serviceManager.setLogger(logger);
    serviceManager.setLogConnectionInfo(te::core::URI(""));

    service.setLogger(logger);
    service.start();

    using namespace terrama2::examples::analysis::utilspostgis;
    using namespace terrama2::examples::analysis::utilsdcpserrmarinpe;

    auto dataProvider = dataProviderPostGis();
    dataManager->add(dataProvider);


    auto outputDataSeries = outputDataSeriesPostGis(dataProvider, dcp_result);
    dataManager->add(outputDataSeries);

   std::string script =
R"z(moBuffer = Buffer(BufferType.Out_union, 2., "km")
ids = dcp.zonal.influence.by_rule("Serra do Mar", moBuffer)
x = dcp.zonal.count("Serra do Mar", moBuffer)
add_value("count", x)
x = dcp.zonal.min("Serra do Mar", "Pluvio", ids)
add_value("min", x)
x = dcp.zonal.max("Serra do Mar", "Pluvio", ids)
add_value("max", x)
x = dcp.zonal.mean("Serra do Mar", "Pluvio", ids)
add_value("mean", x)
x = dcp.zonal.median("Serra do Mar", "Pluvio", ids)
add_value("median", x)
x = dcp.zonal.standard_deviation("Serra do Mar", "Pluvio", ids)
add_value("standard_deviation", x))z";


    std::shared_ptr<terrama2::services::analysis::core::Analysis> analysis = std::make_shared<terrama2::services::analysis::core::Analysis>();
    analysis->id = 1;
    analysis->name = "Min DCP";
    analysis->script = script;
    analysis->scriptLanguage = ScriptLanguage::PYTHON;
    analysis->type = AnalysisType::MONITORED_OBJECT_TYPE;
    analysis->active = true;
    analysis->outputDataSeriesId = outputDataSeries->id;
    analysis->outputDataSetId = outputDataSeries->datasetList.front()->id;
    analysis->serviceInstanceId = 1;

    analysis->metadata["INFLUENCE_TYPE"] = "1";
    analysis->metadata["INFLUENCE_RADIUS"] = "50";
    analysis->metadata["INFLUENCE_RADIUS_UNIT"] = "km";



    auto dataSeriesEstados2010 = dataSeriesPostGis(dataProvider);
    dataManager->add(dataSeriesEstados2010);

    AnalysisDataSeries monitoredObjectADS;
    monitoredObjectADS.id = 1;
    monitoredObjectADS.dataSeriesId = dataSeriesEstados2010->id;
    monitoredObjectADS.type = AnalysisDataSeriesType::DATASERIES_MONITORED_OBJECT_TYPE;
    monitoredObjectADS.metadata["identifier"] = "fid";


    auto dataProviderDCPSerrmar = dataProviderFile();
    dataManager->add(dataProviderDCPSerrmar);



    auto dcpSeriesSerrMar = dataSeries(dataProviderDCPSerrmar);


    AnalysisDataSeries dcpADS;
    dcpADS.id = 2;
    dcpADS.dataSeriesId = dcpSeriesSerrMar->id;
    dcpADS.type = AnalysisDataSeriesType::ADDITIONAL_DATA_TYPE;

    dataManager->add(dcpSeriesSerrMar);


    std::vector<AnalysisDataSeries> analysisDataSeriesList;
    analysisDataSeriesList.push_back(dcpADS);
    analysisDataSeriesList.push_back(monitoredObjectADS);
    analysis->analysisDataSeriesList = analysisDataSeriesList;

    dataManager->add(analysis);

    service.addToQueue(analysis->id, terrama2::core::TimeUtils::nowUTC());

    QTimer timer;
    QObject::connect(&timer, SIGNAL(timeout()), QCoreApplication::instance(), SLOT(quit()));
    timer.start(100000);

    app.exec();
  }

  return 0;
}
