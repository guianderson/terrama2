(function() {
  'use strict';

  // BaseClass
  var Filter = require("./Filter");
  // Enums
  var TemporalityType = require("./../Enums").TemporalityType;
  // DataModels
  var DataSeries = require("./../data-model/DataSeries");

  /**
   * Class responsible for filtering Data Series that are generated by a analysis.
   */
  var AnalysisFilter = module.exports = function() {};

  AnalysisFilter.prototype = Object.create(Filter.prototype);
  AnalysisFilter.prototype.constructor = AnalysisFilter;

  /**
   * It applies a filter over data series to retrieve data series generated by analysis
   *  
   * @param {Array<Analysis>} analysisList - An array of TerraMA2 Analysis
   * @param {Object} extra - An extra object to help filter
   * @param {Array<DataSeries>} extra.dataSeries - Data Series to filter
   * @return {Array<DataSeries>}
   */
  AnalysisFilter.prototype.match = function(analysisList, extra) {
    var dataSeries = extra.dataSeries;
    // creating a copy
    var copyDataSeries = [];
    // removing STATIC
    dataSeries.forEach(function(ds) {
      if (ds.data_series_semantics.temporality !== TemporalityType.STATIC) {
        copyDataSeries.push(new DataSeries(ds));
      }
    });
    var output = [];
    analysisList.forEach(function(analysis) {
      copyDataSeries.some(function(dSeries, dSeriesIndex) {
        return dSeries.dataSets.some(function(dSet) {
          if (dSet.id === analysis.dataset_output) {
            output.push(dSeries);

            delete copyDataSeries[dSeriesIndex];
            return true;
          }
        });
      });
    });

    return output;
  };

} ());