import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const SurveyResponse = ({ survey }) => {
  if (!survey) return null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>RESPUESTAS DE ENCUESTA</Text>
      
      <View style={styles.surveyInfoContainer}>
        <Text style={styles.surveyName}>{survey.surveyName}</Text>
        <Text style={styles.surveyDetail}>Fecha: {survey.date}</Text>
        <Text style={styles.surveyDetail}>Respuestas recibidas: {survey.responseCount}</Text>
        <Text style={styles.surveyDetail}>
          Tipo: {survey.hasCorrectAnswers ? 'Con respuestas correctas' : 'Sin respuestas correctas'}
        </Text>
      </View>

      {survey.questions.map((question, qIndex) => (
        <View key={qIndex} style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.text}</Text>
          <Text style={styles.questionType}>Tipo: {getQuestionTypeText(question.type)}</Text>
          
          {question.type === 'optional' && (
            <View style={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <View key={index} style={[
                  styles.optionItem,
                  question.correctOption === index && styles.correctOption
                ]}>
                  <Text style={styles.optionText}>{option}</Text>
                  {question.correctOption === index && (
                    <Text style={styles.correctBadge}>✓ Correcta</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {question.type === 'multiple' && (
            <View style={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <View key={index} style={styles.optionItem}>
                  <Text style={styles.optionText}>{option}</Text>
                </View>
              ))}
            </View>
          )}

          {question.type === 'open' && (
            <Text style={styles.openResponsePlaceholder}>
              [Respuestas de texto abierto aparecerían aquí]
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

function getQuestionTypeText(type) {
  switch (type) {
    case 'optional': return 'Selección única';
    case 'multiple': return 'Múltiple selección';
    case 'open': return 'Texto abierto';
    default: return type;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  surveyInfoContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#27ae60',
  },
  surveyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  surveyDetail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  questionContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  questionType: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  optionsContainer: {
    marginTop: 5,
  },
  optionItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  correctOption: {
    borderColor: '#27ae60',
    backgroundColor: '#e8f5e9',
  },
  optionText: {
    fontSize: 15,
    color: '#34495e',
  },
  correctBadge: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: 'bold',
    marginTop: 5,
  },
  openResponsePlaceholder: {
    fontStyle: 'italic',
    color: '#95a5a6',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
});

export default SurveyResponse;