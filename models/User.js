import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum:['admin', 'user'],
        default: 'user',
    },
    avatar: {
        type: String,
    },
},{
    timestamps: true
},);

userSchema.pre('save', async function (next){
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    if (!this.avatar) {
        this.avatar = `https://api.dicebear.com/9.x/glass/svg?seed=${this.name}`;
    }

    next();
});

userSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = new mongoose.model('User', userSchema);

export default User;

