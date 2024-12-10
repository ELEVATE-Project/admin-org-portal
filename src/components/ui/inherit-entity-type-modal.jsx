import React, { useState } from 'react'
/* import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button"; */

export const InheritEntityTypeModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    entity_type_value: '',
    target_entity_type_label: '',
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = () => {
    // Basic validation
    if (!formData.entity_type_value || !formData.target_entity_type_label) {
      alert('Please fill in all required fields')
      return
    }

    onSubmit(formData)
  }
}
