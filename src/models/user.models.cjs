module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 50],
          is: {
            args: /^[a-z]+$/,
            msg: "username must contain letters in small.",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: "Email must be a valid email address.",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [8, 100],
            msg: "Password must be at least 8 characters long.",
          },
        },
      },
      role: {
        type: DataTypes.ENUM("admin", "customer"),
        defaultValue: "customer",
      },
    },
    {
      indexes: [{ fields: ["email"], unique: true }],
      tableName: "event_booking_users",
      timestamps: true,
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      scopes: {
        findUser: (email) => ({
          where: { email },
        }),
      },
      hooks: {
        beforeSave: async (user) => {
          if (user.changed("password")) {
            const bcrypt = require("bcrypt");
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    },
  );

  User.associate = (models) => {
    User.hasMany(models.Event, {
      foreignKey: "userId",
      as: "adminEvents",
      onDelete: "CASCADE",
    });

    User.hasMany(models.Booking, {
      foreignKey: "userId",
      as: "customerBookings",
      onDelete: "CASCADE",
    });
  };

  return User;
};
