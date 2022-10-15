module.exports = (sequelize, Sequelize) => {
    const DetailsInfo = sequelize.define("detailsInfo", {
      id: {
        type: Sequelize.INTEGER(11),
        allownull:false,
        autoIncrement:true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "Role cannot be empty !!"}
        }
      },
      employeeCode: {
        type: Sequelize.STRING(),
        allowNull:false,
        unique:true,
        validate:{
          notNull:{ args: true, msg: "EmployeeCode cannot be empty !!"}
        }
      },
      companyName: {
        type: Sequelize.STRING(),
        allowNull:true
      },
      contactNo: {
        type: Sequelize.STRING(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "ContactNo cannot be empty !!"}
        }
      },
      email: {
        type: Sequelize.STRING(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "Email cannot be empty !!"}
        }
      },
      address: {
        type: Sequelize.STRING(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "Address cannot be empty !!"}
        }
      },
      faceRegistration: {
        type: Sequelize.BOOLEAN(),
        allowNull:false,
        defaultValue: false
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
    return DetailsInfo;
  };
  