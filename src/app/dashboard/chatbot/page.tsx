'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Send,
  Bot,
  User,
  HelpCircle,
  Calendar,
  DollarSign,
  FileText,
  Briefcase
} from 'lucide-react'

// Mock chatbot responses
const chatbotResponses = {
  greeting: [
    "Hello! I'm your HR Assistant. How can I help you today?",
    "Hi there! I'm here to assist with your HR queries. What would you like to know?",
    "Welcome! I'm your virtual HR assistant. How may I help you?"
  ],
  leave: [
    "For leave-related queries, you can apply for leave through the Leave Management section. You have 12 days of annual leave remaining.",
    "Leave applications can be submitted via the dashboard. Check your leave balance and apply accordingly.",
    "To apply for leave, go to Leave Management in your dashboard. You can view your balance and submit requests there."
  ],
  salary: [
    "Your salary information is available in the Salary & Pay Slips section. Your last salary was ₹45,000.",
    "For salary details, please check the Salary & Pay Slips section in your dashboard.",
    "Salary slips and payment information can be found in the Salary & Pay Slips section."
  ],
  profile: [
    "You can update your profile information in the Employee Profile section of your dashboard.",
    "Profile updates can be made in the Employee Profile section. Contact HR for major changes.",
    "Your employee profile can be viewed and updated in the Employee Profile section."
  ],
  promotion: [
    "Promotion requests are handled through the Promotion Management section. Check eligibility and submit requests there.",
    "For promotions, visit the Promotion Management section to submit requests and track status.",
    "Promotion applications can be submitted via the Promotion Management section in your dashboard."
  ],
  documents: [
    "Service records and documents are available in the Service Records section.",
    "You can access your service history and documents in the Service Records section.",
    "All your HR documents and service records are stored in the Service Records section."
  ],
  help: [
    "I can help with: Leave applications, Salary information, Profile updates, Promotion queries, Document access, and General HR questions.",
    "Common topics I can assist with: Leave management, Salary details, Employee profile, Promotions, Service records, and HR policies.",
    "I'm here to help with leave applications, salary queries, profile updates, promotion information, document access, and general HR support."
  ],
  default: [
    "I'm sorry, I didn't understand that. Please try rephrasing your question or ask about leave, salary, profile, promotions, or documents.",
    "I apologize, but I couldn't understand your query. Please ask about HR topics like leave, salary, profile, or promotions.",
    "I'm not sure about that. Please ask me about leave management, salary information, profile updates, promotions, or service records."
  ]
}

function getBotResponse(message) {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return chatbotResponses.greeting[Math.floor(Math.random() * chatbotResponses.greeting.length)]
  } else if (lowerMessage.includes('leave') || lowerMessage.includes('vacation') || lowerMessage.includes('holiday')) {
    return chatbotResponses.leave[Math.floor(Math.random() * chatbotResponses.leave.length)]
  } else if (lowerMessage.includes('salary') || lowerMessage.includes('pay') || lowerMessage.includes('slip')) {
    return chatbotResponses.salary[Math.floor(Math.random() * chatbotResponses.salary.length)]
  } else if (lowerMessage.includes('profile') || lowerMessage.includes('information') || lowerMessage.includes('details')) {
    return chatbotResponses.profile[Math.floor(Math.random() * chatbotResponses.profile.length)]
  } else if (lowerMessage.includes('promotion') || lowerMessage.includes('career') || lowerMessage.includes('advance')) {
    return chatbotResponses.promotion[Math.floor(Math.random() * chatbotResponses.promotion.length)]
  } else if (lowerMessage.includes('document') || lowerMessage.includes('record') || lowerMessage.includes('service')) {
    return chatbotResponses.documents[Math.floor(Math.random() * chatbotResponses.documents.length)]
  } else if (lowerMessage.includes('help') || lowerMessage.includes('what') || lowerMessage.includes('can')) {
    return chatbotResponses.help[Math.floor(Math.random() * chatbotResponses.help.length)]
  } else {
    return chatbotResponses.default[Math.floor(Math.random() * chatbotResponses.default.length)]
  }
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your HR Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const quickQuestions = [
    { text: "How do I apply for leave?", icon: <Calendar className="w-4 h-4" /> },
    { text: "Where can I see my salary?", icon: <DollarSign className="w-4 h-4" /> },
    { text: "How to update my profile?", icon: <User className="w-4 h-4" /> },
    { text: "About promotions", icon: <Briefcase className="w-4 h-4" /> },
    { text: "Access my documents", icon: <FileText className="w-4 h-4" /> },
    { text: "What can you help with?", icon: <HelpCircle className="w-4 h-4" /> }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">HR Assistant Chatbot</h1>
          <p className="text-gray-600 mt-2">Get instant automated support for HR queries, leave applications, salary information, and more</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  HR Assistant
                </CardTitle>
                <CardDescription>
                  Ask me anything about leave, salary, profile, promotions, or HR services
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto pr-4 max-h-96">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.sender === 'bot' && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {message.sender === 'user' && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gray-100 text-gray-600">
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex gap-3 justify-start">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input */}
                <div className="flex gap-2 mt-4">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Questions & Info */}
          <div className="space-y-6">
            {/* Quick Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Questions</CardTitle>
                <CardDescription>Click to ask common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => setInputMessage(question.text)}
                    >
                      {question.icon}
                      <span className="ml-2 text-sm">{question.text}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* HR Services */}
            <Card>
              <CardHeader>
                <CardTitle>HR Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">Leave Management</p>
                      <p className="text-xs text-gray-600">Apply for leave, check balance</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">Salary & Payslips</p>
                      <p className="text-xs text-gray-600">View salary details and slips</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <User className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-sm">Employee Profile</p>
                      <p className="text-xs text-gray-600">Update personal information</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-sm">Promotions</p>
                      <p className="text-xs text-gray-600">Apply for promotions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <FileText className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-sm">Service Records</p>
                      <p className="text-xs text-gray-600">Access documents and history</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Need More Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>HR Department:</strong></p>
                  <p>Email: hr@up.gov.in</p>
                  <p>Phone: +91-1234567890</p>
                  <p>Office Hours: 9:00 AM - 5:00 PM</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}