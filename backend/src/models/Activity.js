const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['NEW_STUDENT', 'NEW_INSTRUCTOR', 'NEW_COURSE', 'COURSE_UPDATE', 'STUDENT_ENROLLMENT']
    },
    description: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    metadata: {
        type: Map,
        of: Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Index for efficient querying
activitySchema.index({ createdAt: -1 });

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity; 