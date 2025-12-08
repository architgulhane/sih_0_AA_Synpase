import axios from 'axios';
import { API_BASE_URL } from './config';
import * as DocumentPicker from 'expo-document-picker';

export const predictFasta = async (file: DocumentPicker.DocumentPickerAsset) => {
  const formData = new FormData();
  
  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.mimeType || 'application/octet-stream',
  } as any);

  try {
    const response = await axios.post(`${API_BASE_URL}/predict/fasta`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Predict Fasta error:', error);
    throw error;
  }
};

export const predictSequence = async (sequence: string) => {
  const formData = new FormData();
  formData.append('sequence', sequence);

  try {
    const response = await axios.post(`${API_BASE_URL}/predict/sequence`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Predict Sequence error:', error);
    throw error;
  }
};

export const finetuneModel = async (file: DocumentPicker.DocumentPickerAsset, epochs: number = 1) => {
  const formData = new FormData();
  formData.append('csv_file', {
    uri: file.uri,
    name: file.name,
    type: file.mimeType || 'text/csv',
  } as any);
  formData.append('epochs', epochs.toString());

  try {
    const response = await axios.post(`${API_BASE_URL}/finetune`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Finetune error:', error);
    throw error;
  }
};

// Alias for backward compatibility, but prefer using predictFasta directly
export const uploadFile = predictFasta;
