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

  // Datos de ejemplo para las gráficas (deberías reemplazarlos con los datos reales)
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
  },
  questionContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
});

export default ReviewSurveys;