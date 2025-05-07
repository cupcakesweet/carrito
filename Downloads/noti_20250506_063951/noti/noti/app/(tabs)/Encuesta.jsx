import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BarChart, PieChart } from 'react-native-chart-kit';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Encuesta = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [surveyName, setSurveyName] = useState('');
  const [submittedSurvey, setSubmittedSurvey] = useState(null);
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: '',
      type: 'optional',
      options: ['', '', ''],
      correctOption: null,
    },
  ]);
  const [viewMode, setViewMode] = useState('bar');
  const chartRef = React.useRef();

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
  
    setSubmittedSurvey(surveyData);
    
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

  const SurveyResults = ({ survey }) => {
    if (!survey) {
      return (
        <View style={styles.noSurveyContainer}>
          <Text style={styles.noSurveyText}>No hay encuestas para mostrar</Text>
        </View>
      );
    }

    // Datos de ejemplo para las gráficas (deberías reemplazarlos con tus datos reales)
    const questionData = {
      question: survey.questions[0]?.text || "¿Usted compra verduras baratas?",
      options: [
        { name: "Si", percentage: 15, color: "#2ecc71" },
        { name: "No", percentage: 35, color: "#e74c3c" },
        { name: "A veces", percentage: 50, color: "#f39c12" }
      ]
    };

    const barChartData = {
      labels: questionData.options.map(opt => opt.name),
      datasets: [{
        data: questionData.options.map(opt => opt.percentage)
      }]
    };

    const pieChartData = questionData.options.map(opt => ({
      name: opt.name,
      population: opt.percentage,
      color: opt.color,
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    }));

    const handleDownload = async () => {
      try {
        const uri = await captureRef(chartRef, {
          format: 'png',
          quality: 0.8
        });
        await Sharing.shareAsync(uri);
      } catch (error) {
        Alert.alert('Error', 'No se pudo guardar la imagen');
      }
    };

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.header}>CULTIVA MARKET</Text>
        <Text style={styles.subHeader}>Resultados de Encuesta</Text>
        
        <View style={styles.surveyInfoContainer}>
          <Text style={styles.surveyTitle}>{survey.surveyName}</Text>
          <Text style={styles.surveyDetail}>Fecha: {survey.date}</Text>
          <Text style={styles.surveyDetail}>Tipo de encuesta: {survey.type}</Text>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{questionData.question}</Text>
          
          <View style={styles.viewModeSelector}>
            <TouchableOpacity 
              style={[styles.viewModeButton, viewMode === 'bar' && styles.activeViewMode]}
              onPress={() => setViewMode('bar')}
            >
              <Icon name="bar-chart" size={24} color={viewMode === 'bar' ? 'white' : '#387C2B'} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.viewModeButton, viewMode === 'pie' && styles.activeViewMode]}
              onPress={() => setViewMode('pie')}
            >
              <Icon name="pie-chart" size={24} color={viewMode === 'pie' ? 'white' : '#387C2B'} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.viewModeButton, viewMode === 'list' && styles.activeViewMode]}
              onPress={() => setViewMode('list')}
            >
              <Icon name="list-alt" size={24} color={viewMode === 'list' ? 'white' : '#387C2B'} />
            </TouchableOpacity>
          </View>

          <View style={styles.chartContainer} ref={chartRef}>
            {viewMode === 'bar' && (
              <BarChart
                data={barChartData}
                width={350}
                height={220}
                yAxisLabel=""
                yAxisSuffix="%"
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(56, 124, 43, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  propsForLabels: {
                    fontSize: 12
                  }
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
                fromZero
                showBarTops={false}
                horizontal
              />
            )}

            {viewMode === 'pie' && (
              <PieChart
                data={pieChartData}
                width={350}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            )}

            {viewMode === 'list' && (
              <View style={styles.listContainer}>
                {questionData.options.map((option, index) => (
                  <View key={index} style={styles.optionItem}>
                    <Text style={styles.optionText}>{option.name}</Text>
                    <Text style={styles.percentageText}>{option.percentage}%</Text>
                    <View style={styles.percentageBarContainer}>
                      <View style={[
                        styles.percentageBar,
                        { 
                          width: `${option.percentage}%`,
                          backgroundColor: option.color
                        }
                      ]} />
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
          <Icon name="file-download" size={24} color="white" />
          <Text style={styles.downloadButtonText}>Descargar gráficos</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'create' && styles.activeTab]}
          onPress={() => setActiveTab('create')}
        >
          <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
            Crear encuesta
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'review' && styles.activeTab]}
          onPress={() => setActiveTab('review')}
        >
          <Text style={[styles.tabText, activeTab === 'review' && styles.activeTabText]}>
            Revisar encuestas
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'create' ? (
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
                  <TouchableOpacity
                    style={styles.addOptionButton}
                    onPress={() => addOption(question.id)}
                  >
                    <Text style={styles.addOptionButtonText}>+ Añadir opción</Text>
                  </TouchableOpacity>

                  {question.correctOption !== null && (
                    <TouchableOpacity
                      style={styles.clearCorrectButton}
                      onPress={() => setCorrectOption(question.id, null)}
                    >
                      <Text style={styles.clearCorrectButtonText}>Quitar respuesta correcta</Text>
                    </TouchableOpacity>
                  )}
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
                  <TouchableOpacity
                    style={styles.addOptionButton}
                    onPress={() => addOption(question.id)}
                  >
                    <Text style={styles.addOptionButtonText}>+ Añadir opción</Text>
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

          <TouchableOpacity style={styles.addQuestionButton} onPress={addQuestion}>
            <Text style={styles.addQuestionButtonText}>+ Añadir pregunta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={submitSurvey}>
            <Text style={styles.submitButtonText}>Enviar encuesta</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <SurveyResults survey={submittedSurvey} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#387C2B',
  },
  tabText: {
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: 'white',
  },
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
  addOptionButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  addOptionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
  noSurveyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noSurveyText: {
    fontSize: 18,
    color: '#95a5a6',
  },
  surveyInfoContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#27ae60',
  },
  surveyTitle: {
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
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50'
  },
  viewModeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15
  },
  viewModeButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#387C2B'
  },
  activeViewMode: {
    backgroundColor: '#387C2B'
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  listContainer: {
    width: '100%'
  },
  optionItem: {
    marginBottom: 15
  },
  optionText: {
    fontSize: 16,
    marginBottom: 5
  },
  percentageText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5
  },
  percentageBarContainer: {
    height: 10,
    width: '100%',
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
    overflow: 'hidden'
  },
  percentageBar: {
    height: '100%',
    borderRadius: 5
  },
  downloadButton: {
    flexDirection: 'row',
    backgroundColor: '#387C2B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  downloadButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16
  }
});

export default Encuesta;