module.exports = function(sequelize, DataTypes) {
  var Project = sequelize.define("Project", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      version: DataTypes.INTEGER,
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        comment: "Project name"
      },
      description: {
        type: DataTypes.TEXT,
        comment: "Project description."
      }
    },
    {
      underscored: true,
      underscoredAll: true,
      timestamps: false,

      classMethods: {
        associate: function(models) {
          Project.hasMany(models.DataProvider, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
          });

          Project.hasMany(models.Analysis, {
            onDelete: "CASCADE",
            foreignKey: {
              name: 'project_id',
              allowNull: false
            }
          });
          // Setting project to View. A project has many views
          Project.hasMany(models.View, {
            onDelete: "CASCADE",
            foreignKey: {
              name: "project_id",
              allowNull: false
            }
          });
        }
      }
    }
  );

  return Project;
};