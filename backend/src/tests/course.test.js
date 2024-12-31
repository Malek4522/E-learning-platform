const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Course = require('../models/Course');
const User = require('../models/User');
const { generateToken } = require('../utils/auth');

describe('Course API', () => {
    let token;
    let teacherId;
    let courseId;

    beforeAll(async () => {
        // Create a test teacher
        const teacher = await User.create({
            email: 'teacher@test.com',
            password: 'password123',
            role: 'teacher',
            profile: {
                first_name: 'Test',
                last_name: 'Teacher'
            }
        });
        teacherId = teacher._id;
        token = generateToken(teacher);
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Course.deleteMany({});
        await mongoose.connection.close();
    });

    describe('POST /api/courses', () => {
        it('should create a new course', async () => {
            const courseData = {
                title: 'Test Course',
                description: 'Test Description',
                price: 99.99,
                categories: ['programming'],
                chapters: [{
                    chapter_title: 'Chapter 1',
                    lessons: [{
                        content: {
                            video: {
                                video_url: 'http://example.com/video.mp4',
                                description: 'Test video',
                                duration: 300
                            }
                        },
                        quiz: {
                            quiz_title: 'Test Quiz',
                            questions: [{
                                question_text: 'Test question?',
                                options: ['A', 'B', 'C', 'D'],
                                correct_answer_index: 0,
                                explanation: 'Test explanation'
                            }]
                        }
                    }]
                }]
            };

            const response = await request(app)
                .post('/api/courses')
                .set('Authorization', `Bearer ${token}`)
                .send(courseData);

            expect(response.status).toBe(201);
            expect(response.body.title).toBe(courseData.title);
            courseId = response.body._id;
        });
    });

    describe('GET /api/courses', () => {
        it('should get all courses', async () => {
            const response = await request(app)
                .get('/api/courses')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    // Add more test cases for other endpoints
}); 