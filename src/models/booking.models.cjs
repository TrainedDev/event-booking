module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    "Booking",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      totalBuyingTickets: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: "totalBuyingTickets must be greater than 0.",
          },
        },
      },
      totalTicketsPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: "totalTicketsPrice must be greater than 0.",
          },
        },
      },
    },

    {
      tableName: "event_booking_bookings",
      timestamps: true,
    },
  );

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: "userId",
      as: "customer",
    });

    Booking.belongsTo(models.Event, {
      foreignKey: "eventId",
      as: "event",
    });
  };

  return Booking;
};
