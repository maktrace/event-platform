import mongoose, { Document, Schema, Types } from "mongoose";

export type RegistrationStatus = "registered" | "cancelled";

export interface IRegistration extends Document {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  registeredAt: Date;
  status: RegistrationStatus;
}

const registrationSchema = new Schema<IRegistration>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  eventId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },

  registeredAt: {
    type: Date,
    default: Date.now,
  },

  status: {
    type: String,
    enum: ["registered", "cancelled"],
    default: "registered",
  },
});

registrationSchema.index(
  { userId: 1, eventId: 1 },
  { unique: true }
);

export const Registration = mongoose.model<IRegistration>(
  "Registration",
  registrationSchema
);