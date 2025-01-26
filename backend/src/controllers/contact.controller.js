const Contact = require('../models/contact');

// Create new contact message
exports.createContact = async (req, res) => {
    try {
        const { name, email, phoneNumber, subject, message } = req.body;

        const contact = new Contact({
            name,
            email,
            phoneNumber,
            subject, 
            message
        });

        await contact.save();

        res.status(201).json({
            success: true,
            message: 'Contact message sent successfully',
            data: contact
        });

    } catch (error) {
        console.error('Error in createContact:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending contact message',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all contact messages
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });

    } catch (error) {
        console.error('Error in getAllContacts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact messages',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update contact status
exports.updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['awaiting', 'responded'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value. Must be either "awaiting" or "responded"'
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact status updated successfully',
            data: contact
        });

    } catch (error) {
        console.error('Error in updateContactStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating contact status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
