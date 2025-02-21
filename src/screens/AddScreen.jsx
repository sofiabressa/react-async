import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TextInput, Button } from "@react-native-material/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DatePicker from "react-datepicker"; // Importação do DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Estilos do DatePicker
import { v4 as uuidv4 } from "uuid";

const AddTaskScreen = ({ navigation }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState(new Date());
  const [taskStatus, setTaskStatus] = useState("aberta");

  const saveTask = async () => {
    try {
      const task = {
        id: uuidv4(),
        title: taskTitle,
        description: taskDescription,
        date: taskDate,
        status: taskStatus,
      };

      const tasks = await AsyncStorage.getItem("tasks");
      const taskArray = JSON.parse(tasks) || [];

      taskArray.push(task);
      await AsyncStorage.setItem("tasks", JSON.stringify(taskArray));

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      console.error("Erro ao salvar tarefa: ", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Adicionar Tarefa</Text>
      <TextInput
        style={styles.input}
        placeholder="Título da Tarefa"
        value={taskTitle}
        onChangeText={(text) => setTaskTitle(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição da Tarefa"
        value={taskDescription}
        onChangeText={(text) => setTaskDescription(text)}
      />
      <View style={{ flexDirection: "column", width: "100%", marginBottom: 20 }}>
        <View style={{ marginBottom: 10 }}>
          <Text style={{ marginBottom: 5 }}>Data de Término da Tarefa:</Text>
          <DatePicker
            selected={taskDate}
            onChange={(date) => setTaskDate(date)}
            showTimeSelect
            dateFormat="dd/MM/yyyy HH:mm"
            className="datepicker"
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ marginBottom: 5 }}>Status da Tarefa:</Text>
          <Picker
            style={styles.picker}
            selectedValue={taskStatus}
            onValueChange={(itemValue) => setTaskStatus(itemValue)}
          >
            <Picker.Item label="Aberta" value="aberta" />
            <Picker.Item label="Realizada" value="realizada" />
            <Picker.Item
              label="Parcialmente Realizada"
              value="parcialmente_realizada"
            />
            <Picker.Item label="Atrasada" value="atrasada" />
            <Picker.Item label="Cancelada" value="cancelada" />
          </Picker>
        </View>
      </View>
      <Button title="Salvar" onPress={saveTask} style={styles.button} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
  },
  picker: {
    width: "100%",
  },
});

export default AddTaskScreen;
