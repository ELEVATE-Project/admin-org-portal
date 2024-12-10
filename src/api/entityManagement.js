import axios from './axios'

// Fetch all entity types
export const fetchEntityTypes = async () => {
  try {
    const response = await axios.post('/mentoring/v1/entity-type/read', {}, {})
    return response.data
  } catch (error) {
    console.error('Error fetching entity types', error)
    throw error
  }
}

// Fetch entities by entity type
export const fetchEntitiesByType = async (entityTypeId, page = 1, limit = 10, search = '') => {
  try {
    const response = await axios.post(
      `/mentoring/v1/entity/list`,
      { search },
      {
        params: {
          entity_type_id: entityTypeId,
          page,
          limit,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error fetching entities', error)
    throw error
  }
}

// Create a new entity type
export const createEntityType = async entityTypeData => {
  const response = await axios.post('/mentoring/v1/entity-type/create', {
    value: entityTypeData.value,
    label: entityTypeData.label,
    data_type: entityTypeData.data_type,
    allow_filtering: entityTypeData.allow_filtering,
    has_entities: entityTypeData.has_entities,
    allow_custom_entities: entityTypeData.allow_custom_entities,
    model_names: entityTypeData.model_names,
    required: entityTypeData.required,
    regex: entityTypeData?.regex,
  })
  return response.data
}

// Create a new entity
export const createEntity = async entity => {
  try {
    const response = await axios.post('/mentoring/v1/entity/create', entity, {})
    return response.data
  } catch (error) {
    console.error('Error creating entity', error)
    throw error
  }
}

// Inherit an entity type
export const inheritEntityType = async data => {
  try {
    const reqBody = {
      entity_type_value: data.entityTypeValue,
      target_entity_type_label: data.entityTypeLabel,
    }
    const response = await axios.post('/mentoring/v1/org-admin/inheritEntityType', reqBody, {})
    return response.data
  } catch (error) {
    console.error('Error inheriting entity type', error)
    throw error
  }
}
export const deleteEntity = async entityId => {
  try {
    const response = await axios.delete('/mentoring/v1/entity/delete/' + entityId)
    return response.data
  } catch (error) {
    console.error('Error deleting entity', error)
    throw error
  }
}
export const updateEntity = async (id, data) => {
  try {
    const response = await axios.put('/mentoring/v1/entity/update/' + id, data, {})
    return response.data
  } catch (error) {
    console.error('Error inheriting entity type', error)
    throw error
  }
}
export const deleteEntityType = async entityId => {
  try {
    const response = await axios.delete('/mentoring/v1/entity-type/delete/' + entityId, {})
    return response.data
  } catch (error) {
    console.error('Error deleting entity', error)
    throw error
  }
}
export const updateEntityType = async inheritData => {
  try {
    const response = await axios.post('/mentoring/v1/entity/update', inheritData, {})
    return response.data
  } catch (error) {
    console.error('Error inheriting entity type', error)
    throw error
  }
}
