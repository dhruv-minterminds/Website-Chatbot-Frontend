import React, { useState } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

const CaptureForm = ({ onSubmit, onClose, triggerReason }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        category: 'services',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const getTriggerMessage = () => {
        const messages = {
            'exit_intent': {
                title: "Don't miss out!",
                subtitle: "Before you go, let us know how we can help you succeed."
            },
            'keyword_detected': {
                title: "Perfect match!",
                subtitle: "Great! Let's connect you with our team for personalized assistance."
            },
            'high_engagement': {
                title: "Thanks for chatting!",
                subtitle: "You're clearly interested - let's take this conversation further."
            },
            'default': {
                title: "Let's connect!",
                subtitle: "Get personalized guidance from our expert team."
            }
        };

        const message = messages[triggerReason] || messages['default'];
        return {
            title: message.title,
            subtitle: message.subtitle
        };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await onSubmit(formData);
            setSubmitSuccess(true);

            // Reset form after success (optional - keep commented if you want to keep form data)
            // setTimeout(() => {
            //     setFormData({
            //         name: '',
            //         email: '',
            //         phone: '',
            //         category: 'services',
            //     });
            //     setSubmitSuccess(false);
            // }, 3000);

        } catch (error) {
            setErrors({
                submit: error.message || 'Failed to submit. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaCheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Thank You!</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Your information has been submitted successfully. Our team will contact you soon.
                        </p>
                        <div className="bg-blue-50 p-3 rounded-lg mb-4">
                            <p className="text-xs font-medium text-blue-800 mb-1">What happens next:</p>
                            <ul className="text-xs text-blue-700 space-y-1">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                    <span>Confirmation email within minutes</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                    <span>Personalized follow-up within 24 hours</span>
                                </li>
                            </ul>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors w-full"
                        >
                            Continue Chatting
                        </button>
                        <p className="text-xs text-gray-500 mt-3">
                            Check your spam folder if you don't see our email
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const triggerInfo = getTriggerMessage();

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full">
                {/* Header */}
                <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-base font-medium">{triggerInfo.title}</h3>
                            <p className="text-blue-100 text-xs mt-0.5">
                                {triggerInfo.subtitle}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer"
                            title="Close"
                        >
                            <FaTimes className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    {errors.submit && (
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm flex items-center gap-2">
                                <span className="text-red-500">⚠</span>
                                {errors.submit}
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                    <FaUser className="w-3 h-3 text-blue-600" />
                                </div>
                                <span>Full Name *</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none ${errors.name ? 'border-red-300' : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
                                placeholder="Your full name"
                                required
                            />
                            {errors.name && (
                                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                    <span className="text-red-500">✕</span>
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                    <FaEnvelope className="w-3 h-3 text-blue-600" />
                                </div>
                                <span>Email Address *</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none ${errors.email ? 'border-red-300' : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
                                placeholder="your.email@example.com"
                                required
                            />
                            {errors.email && (
                                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                    <span className="text-red-500">✕</span>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                    <FaPhone className="w-3 h-3 text-blue-600" />
                                </div>
                                <span>Phone Number (Optional)</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none ${errors.phone ? 'border-red-300' : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
                                placeholder="+1 (555) 123-4567"
                            />
                            {errors.phone && (
                                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                    <span className="text-red-500">✕</span>
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        {/* Category Selection */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                What are you interested in? *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="services">Services & Development</option>
                                <option value="trainings">Training Programs</option>
                                <option value="careers">Career Opportunities</option>
                                <option value="general">General Inquiry</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-2.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${isSubmitting || !formData.name.trim() || !formData.email.trim()
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow cursor-pointer'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <FaPaperPlane className="w-3.5 h-3.5" />
                                    <span>Submit Information</span>
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-2.5 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 transition-colors duration-200 cursor-pointer"
                        >
                            Maybe Later
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CaptureForm;