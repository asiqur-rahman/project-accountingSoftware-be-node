module.exports = (sequelize, Sequelize) => {
    const EmployeeWages = sequelize.define("employeeWages", {
      id: {
        type: Sequelize.INTEGER(11),
        allownull:false,
        autoIncrement:true,
        primaryKey: true
      },
      dateFrom: {
        type: Sequelize.DATE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "DATE from cannot be empty !!"}
        }
      },
      dateTo: {
        type: Sequelize.DATE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "DATE to cannot be empty !!"}
        }
      },
      salary: {
        type: Sequelize.DOUBLE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "Salary cannot be empty !!"}
        }
      },
      payg: {
        type: Sequelize.DOUBLE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "Payg cannot be empty !!"}
        }
      },
      super: {
        type: Sequelize.DOUBLE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "Super cannot be empty !!"}
        }
      },
      annual: {
        type: Sequelize.DOUBLE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "Annual cannot be empty !!"}
        }
      },
      cash: {
        type: Sequelize.DOUBLE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "Cash cannot be empty !!"}
        }
      },
      description: {
        type: Sequelize.STRING(),
        allowNull:true,
      },
      isActive: {
        type: Sequelize.BOOLEAN(),
        allowNull:false,
        defaultValue: true
      } 
    },
    
    {
      defaultScope: {
        where:{
          isActive: true
        },
        attributes: {
           exclude: ['createdAt','updatedAt']
        }
      },
      scopes: {
        notActive: {
          where:{
            isActive: false
          },
          attributes: {
             exclude: ['id','createdAt','updatedAt']
          }
        },
        allData: {
          where:{

          },
          attributes: {
             exclude: ['id','createdAt','updatedAt']
          }
        }
    }
  });
    return EmployeeWages;
  };
  