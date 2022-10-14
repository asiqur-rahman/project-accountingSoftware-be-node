module.exports = (sequelize, Sequelize) => {
    const UserDetails = sequelize.define("userDetails", {
      id: {
        type: Sequelize.INTEGER(11),
        allownull:false,
        autoIncrement:true,
        primaryKey: true
      },
      firstName: {
        type: Sequelize.STRING(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "Firstname cannot be empty !!"}
        }
      },
      lastName: {
        type: Sequelize.STRING(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "Lastname cannot be empty !!"}
        }
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
      description: {
        type: Sequelize.STRING(),
        allowNull:true,
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
    return UserDetails;
  };
  