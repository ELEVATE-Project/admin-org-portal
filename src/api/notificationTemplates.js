import axios from './axios'

// Fetch all notification templates
export const fetchNotificationTemplates = async (organizationId = '') => {
  try {
    const response = await axios.get('/mentoring/v1/notification/template', {
      params: organizationId ? { organization_id: organizationId } : {},
    })
    return response.data
  } catch (error) {
    console.error('Error fetching notification templates', error)
    throw error
  }
}

// Fetch a specific notification template by ID
export const fetchNotificationTemplateById = async (templateId, organizationId) => {
  try {
    const response = await axios.get(`/mentoring/v1/notification/template/${templateId}`, {
      params: { organization_id: organizationId },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching notification template', error)
    throw error
  }
}

// Create a new notification template
export const createNotificationTemplate = async templateData => {
  try {
    const response = await axios.post('/mentoring/v1/notification/template', {
      code: templateData.code,
      type: templateData.type,
      subject: templateData.subject,
      body: templateData.body,
      email_header: templateData.email_header,
      email_footer: templateData.email_footer,
    })
    return response.data
  } catch (error) {
    console.error('Error creating notification template', error)
    throw error
  }
}

// Update an existing notification template
export const updateNotificationTemplate = async (templateId, templateData) => {
  try {
    const response = await axios.patch(`/mentoring/v1/notification/template/${templateId}`, {
      type: templateData.type,
      subject: templateData.subject,
      body: templateData.body,
      status: templateData.status,
      email_header: templateData.email_header,
      email_footer: templateData.email_footer,
    })
    return response.data
  } catch (error) {
    console.error('Error updating notification template', error)
    throw error
  }
}

// Delete a notification template
export const deleteNotificationTemplate = async templateId => {
  try {
    const response = await axios.delete(`/mentoring/v1/notification/template/${templateId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting notification template', error)
    throw error
  }
}
