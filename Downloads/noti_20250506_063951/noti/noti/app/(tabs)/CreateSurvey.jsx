import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CreateSurvey = ({ onSubmitSurvey, setActiveTab }) => {
  const [surveyName, setSurveyName] = useState('');
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: '',
      type: 'optional',
      options: ['', '', ''],
      correctOption: null,
    },
  ]);

  const resetForm = () => {
    setSurveyName('');
    setQuestions([
      {
        id: 1,
        text: '',
        type: 'optional',
        options: ['', '', ''],
        correctOption: null,
      },
    ]);
  };

  const addQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    setQuestions([
      ...questions,
      {
        id: newId,
        text: '',
        type: 'optional',
        options: ['', '', ''],
        correctOption: null,
      },
    ]);
  };

  const addOption = (questionId) => {
    setQuestions(
      questions.map(question =>
        question.id === questionId
          ? { ...question, options: [...question.options, ''] }
          : question
      )
    );
  };

  const updateQuestionText = (questionId, text) => {
    setQuestions(
      questions.map(question =>
        question.id === questionId ? { ...question, text } : question
      )
    );
  };

  const updateOptionText = (questionId, optionIndex, text) => {
    setQuestions(
      questions.map(question =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((opt, idx) =>
                idx === optionIndex ? text : opt
              ),
            }
          : question
      )
    );
  };

  const updateQuestionType = (questionId, type) => {
    setQuestions(
      questions.map(question =>
        question.id === questionId
          ? {
              ...question,
              type,
              options: type === 'optional' ? ['', '', ''] : [],
              correctOption: null,
            }
          : question
      )
    );
  };

  const setCorrectOption = (questionId, optionIndex) => {
    setQuestions(
      questions.map(question =>
        question.id === questionId
          ? { ...question, correctOption: optionIndex }
          : question
      )
    );
  };

  const removeQuestion = (questionId) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(question => question.id !== questionId));
    } else {
      Alert.alert('Error', 'Debe haber al menos una pregunta');
    }
  };

  const submitSurvey = () => {
    if (!surveyName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para la encuesta');
      return;
    }

    for (const question of questions) {
      if (!question.text.trim()) {
        Alert.alert('Error', `La pregunta #${question.id} no puede estar vacía`);
        return;
      }

      if (question.type === 'optional') {
        for (const option of question.options) {
          if (!option.trim()) {
            Alert.alert('Error', `La pregunta #${question.id} tiene opciones vacías`);
            return;
          }
        }
      }
    }

    const surveyData = {
      surveyName,
      questions,
      date: new Date().toLocaleDateString('es-ES'),
      responseCount: 0,
      type: 'Opcional'
    };

    onSubmitSurvey(surveyData);
    
    Alert.alert('Éxito', 'Encuesta creada correctamente', [
      {
        text: 'OK',
        onPress: () => {
          resetForm();
          setActiveTab('review');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>CULTIVA MARKET</Text>
      <Text style={styles.subHeader}>Encuestas</Text>
      <Text style={styles.sectionHeader}>Crear encuestas</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la encuesta..."
          value={surveyName}
          onChangeText={setSurveyName}
        />
      </View>

      {questions.map((question, qIndex) => (
        <View key={question.id} style={styles.questionContainer}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionTitle}>Pregunta #{qIndex + 1}</Text>
            {questions.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeQuestion(question.id)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Pregunta..."
            value={question.text}
            onChangeText={text => updateQuestionText(question.id, text)}
          />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={question.type}
              onValueChange={type => updateQuestionType(question.id, type)}
              style={styles.picker}
            >
              <Picker.Item label="Opcional (selección única)" value="optional" />
              <Picker.Item label="Abierta (texto libre)" value="open" />
              <Picker.Item label="Múltiples (varias opciones)" value="multiple" />
            </Picker>
          </View>

          {question.type === 'optional' && (
            <>
              <Text style={styles.optionsLabel}>Opciones:</Text>
              {question.options.map((option, index) => (
                <View key={index} style={styles.optionRow}>
                  <TextInput
                    style={[styles.input, styles.optionInput]}
                    placeholder={`Opción ${index + 1}`}
                    value={option}
                    onChangeText={text => updateOptionText(question.id, index, text)}
                  />
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      question.correctOption === index && styles.radioButtonSelected,
                    ]}
                    onPress={() => setCorrectOption(question.id, index)}
                  >
                    {question.correctOption === index && (
                      <Text style={styles.radioButtonSelectedText}>✓</Text>
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            <View style={styles.buttonsRow}>
                <TouchableOpacity
                  style={[styles.addButton, {flex: 1}]}
                  onPress={() => addOption(question.id)}
                >
                  <Icon name="add" size={20} color="white" />
                  <Text style={styles.addButtonText}>Añadir opción</Text>
                </TouchableOpacity>

                {question.type === 'optional' && question.correctOption !== null && (
                  <TouchableOpacity
                    style={[styles.addButton, {backgroundColor: '#e67e22', marginLeft: 10}]}
                    onPress={() => setCorrectOption(question.id, null)}
                  >
                    <Icon name="clear" size={20} color="white" />
                    <Text style={styles.addButtonText}>Quitar correcta</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}

          {question.type === 'multiple' && (
            <>
              <Text style={styles.optionsLabel}>Opciones:</Text>
              {question.options.map((option, index) => (
                <View key={index} style={styles.optionRow}>
                  <TextInput
                    style={[styles.input, styles.optionInput]}
                    placeholder={`Opción ${index + 1}`}
                    value={option}
                    onChangeText={text => updateOptionText(question.id, index, text)}
                  />
                </View>
              ))}
                <TouchableOpacity style={styles.secondaryButton} onPress={addQuestion}>
          <Icon name="add-circle-outline" size={24} color="#387C2B" />
          <Text style={styles.secondaryButtonText}>Añadir pregunta</Text>
        </TouchableOpacity>
            </>
          )}

          {question.type === 'open' && (
            <View style={styles.openQuestionContainer}>
              <Text style={styles.openQuestionLabel}>Abierta (texto libre)</Text>
              <TextInput
                style={[styles.input, styles.openInput]}
                placeholder="El usuario podrá escribir una respuesta extensa aquí..."
                multiline
                editable={false}
              />
            </View>
          )}
        </View>
      ))}
   <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={addQuestion}>
          <Icon name="add-circle-outline" size={24} color="#387C2B" />
          <Text style={styles.secondaryButtonText}>Añadir pregunta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={submitSurvey}>
          <Icon name="send" size={24} color="white" />
          <Text style={styles.primaryButtonText}>Publicar encuesta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
    backgroundColor: '#27ae60',
    paddingVertical: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#2ecc71',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2c3e50',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    marginBottom: 10,
  },
  questionContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 35,
    marginBottom: 8,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginVertical: 10,
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: 'white',
    height: 50,
  },
  optionsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#2c3e50',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionInput: {
    flex: 1,
    marginRight: 10,
  },
  radioButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#387C2B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#7CBE6B',
  },
  radioButtonSelectedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  buttonsRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 14,
  },
  clearCorrectButton: {
    backgroundColor: '#e67e22',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  clearCorrectButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  openQuestionContainer: {
    marginTop: 10,
  },
  openQuestionLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  openInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  addQuestionButton: {
    backgroundColor: '#2ecc71',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addQuestionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: '#387C2B',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#387C2B',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 18,
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#387C2B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  secondaryButtonText: {
    color: '#387C2B',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default CreateSurvey;