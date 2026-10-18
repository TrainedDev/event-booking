module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "Event",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [3, 50],
            msg: "title must be between 3 and 50 characters long.",
          },
          is: {
            args: /^[a-zA-Z\s]+$/,
            msg: "title must contain only letters, and spaces.",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: {
            args: [10, 500],
            msg: "description must be between 10 and 500 characters long.",
          },
          is: {
            args: /^[a-zA-Z0-9\s]+$/,
            msg: "description must contain only letters, numbers, and spaces.",
          },
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[a-zA-Z0-9\s]+$/,
            msg: "location must contain only letters, numbers, and spaces with no special characters.",
          },
        },
      },
      ticketPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: "ticketPrice must be greater than 0.",
          },
        },
      },
      totalTickets: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: "totalTickets must be greater than 0.",
          },
        },
      },
    },
    {
      tableName: "event_booking_events",
      timestamps: true,
      indexes: [{ fields: ["title"], unique: true }],
    },
  );

  Event.associate = (models) => {
    Event.belongsTo(models.User, {
      foreignKey: "userId",
      as: "event_organizer",
    });

    Event.hasMany(models.Booking, {
      foreignKey: "eventId",
      as: "bookings",
    });
  };

  return Event;
};
