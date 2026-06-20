import mongoose from 'mongoose';


export type UserRole = 'user' | 'admin';

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    state: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false }
}, {
    timestamps: false
})

const UserSchema = new mongoose.Schema({
    clerkUserId: {
        type: String,
        required: true,
        unoque: true,
        index: false,
    },
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    points: {
        type: String,
        default: false,
        min: 0
    },
    address: {
        type: [addressSchema],
        default: []
    },
}, {
    timestamps:true,
})

export const User = mongoose.models.User || mongoose.model("User", UserSchema)