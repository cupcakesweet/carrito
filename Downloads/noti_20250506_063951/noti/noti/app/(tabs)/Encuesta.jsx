import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import CreateSurvey from './CreateSurvey';
import ReviewSurveys from './ReviewSurveys';

const Encuesta = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [submittedSurvey, setSubmittedSurvey] = useState(null);

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
        <CreateSurvey 
          onSubmitSurvey={setSubmittedSurvey} 
          setActiveTab={setActiveTab} 
        />
      ) : (
        <ReviewSurveys survey={submittedSurvey} />
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
});

export default Encuesta;