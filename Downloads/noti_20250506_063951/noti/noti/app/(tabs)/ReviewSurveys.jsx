import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ReviewSurveys = ({ survey }) => {
  const [viewMode, setViewMode] = useState('bar');
  const chartRef = useRef();

  if (!survey) {
    return (
      <View style={styles.noSurveyContainer}>
        <Text style={styles.noSurveyText}>No hay encuestas para mostrar</Text>
      </View>
    );
  }

  // Datos de ejemplo para todas las preguntas
  const generateQuestionData = (question) => {
    const responseCount = survey.responseCount || 100; 
    
    if (question.type === 'open') {
      return {
        question: question.text,
        type: 'open',
        responses: [
          { text: "Las verduras son frescas y de buena calidad", count: 35 },
          { text: "Precios accesibles", count: 25 },
          { text: "Variedad de productos", count: 20 },
          { text: "Otras respuestas", count: 20 }
        ]
      };
    } else {
      const options = question.options.map((opt, index) => ({
        name: opt,
        count: Math.floor(Math.random() * responseCount / 2) + 10,
        color: ['#2ecc71', '#e74c3c', '#f39c12', '#3498db', '#9b59b6'][index % 5]
      }));
      
      // Ajustar para que la suma no exceda el responseCount
      const total = options.reduce((sum, opt) => sum + opt.count, 0);
      const adjustmentFactor = responseCount / total;
      
      return {
        question: question.text,
        type: question.type,
        options: options.map(opt => ({
          ...opt,
          count: Math.round(opt.count * adjustmentFactor),
          percentage: Math.round((opt.count * adjustmentFactor / responseCount) * 100)
        })),
        responseCount
      };
    }
  };

  const allQuestionsData = survey.questions.map(generateQuestionData);

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

  const renderQuestionCharts = (questionData) => {
    if (questionData.type === 'open') {
      return (
        <View style={styles.openResponsesContainer}>
          <Text style={styles.responsesHeader}>Respuestas más frecuentes:</Text>
          {questionData.responses.map((response, index) => (
            <View key={index} style={styles.openResponseItem}>
              <Text style={styles.openResponseText}>{response.text}</Text>
              <Text style={styles.openResponseCount}>{response.count} respuestas</Text>
            </View>
          ))}
        </View>
      );
    }

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

    return (
      <>
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
                <Text style={styles.percentageText}>
                  {option.count} respuestas ({option.percentage}%)
                </Text>
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
            <Text style={styles.totalResponses}>
              Total respuestas: {questionData.responseCount}
            </Text>
          </View>
        )}
      </>
    );
  };

  return (
    <ScrollView style={styles.container} ref={chartRef}>
      <Text style={styles.header}>CULTIVA MARKET</Text>
      <Text style={styles.subHeader}>Resultados de Encuesta</Text>
      
      <View style={styles.surveyInfoContainer}>
        <Text style={styles.surveyTitle}>{survey.surveyName}</Text>
        <Text style={styles.surveyDetail}>Fecha: {survey.date}</Text>
        <Text style={styles.surveyDetail}>Tipo de encuesta: {survey.type}</Text>
        <Text style={styles.surveyDetail}>Total respuestas: {survey.responseCount || 100}</Text>
      </View>

      <View style={styles.viewModeSelector}>
        <TouchableOpacity 
          style={[styles.viewModeButton, viewMode === 'bar' && styles.activeViewMode]}
          onPress={() => setViewMode('bar')}
        >
          <Icon name="bar-chart" size={24} color={viewMode === 'bar' ? 'white' : '#387C2B'} />
          <Text style={[styles.viewModeButtonText, viewMode === 'bar' && styles.activeViewModeText]}>Barras</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.viewModeButton, viewMode === 'pie' && styles.activeViewMode]}
          onPress={() => setViewMode('pie')}
        >
          <Icon name="pie-chart" size={24} color={viewMode === 'pie' ? 'white' : '#387C2B'} />
          <Text style={[styles.viewModeButtonText, viewMode === 'pie' && styles.activeViewModeText]}>Torta</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.viewModeButton, viewMode === 'list' && styles.activeViewMode]}
          onPress={() => setViewMode('list')}
        >
          <Icon name="list-alt" size={24} color={viewMode === 'list' ? 'white' : '#387C2B'} />
          <Text style={[styles.viewModeButtonText, viewMode === 'list' && styles.activeViewModeText]}>Lista</Text>
        </TouchableOpacity>
      </View>

      {allQuestionsData.map((questionData, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.questionText}>
            Pregunta {index + 1}: {questionData.question}
            {questionData.type === 'open' && (
              <Text style={styles.questionTypeTag}> (Abierta)</Text>
            )}
          </Text>
          
          <View style={styles.chartContainer}>
            {renderQuestionCharts(questionData)}
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
        <Icon name="file-download" size={24} color="white" />
        <Text style={styles.downloadButtonText}>Descargar resultados</Text>
      </TouchableOpacity>
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
  questionContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50'
  },
  questionTypeTag: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic'
  },
  viewModeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  viewModeButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#387C2B',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  viewModeButtonText: {
    marginLeft: 5,
    color: '#387C2B',
    fontWeight: 'bold'
  },
  activeViewMode: {
    backgroundColor: '#387C2B'
  },
  activeViewModeText: {
    color: 'white'
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
  totalResponses: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 10,
    textAlign: 'right'
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
  },
  openResponsesContainer: {
    width: '100%',
    padding: 10
  },
  responsesHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50'
  },
  openResponseItem: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#27ae60'
  },
  openResponseText: {
    fontSize: 14,
    marginBottom: 3
  },
  openResponseCount: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic'
  }
});

export default ReviewSurveys;