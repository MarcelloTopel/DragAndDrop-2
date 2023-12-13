// Importando React e os componentes necessários do react-beautiful-dnd
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

// Definindo uma lista de tarefas iniciais
const tasks = [
  { id: "1", content: "Primeira tarefa" },
  { id: "2", content: "Segunda tarefa" },
  { id: "3", content: "Terceira tarefa" },
  { id: "4", content: "Quarta tarefa" },
  { id: "5", content: "Quinta tarefa" }
];

// Definindo os status das tarefas
const taskStatus = {
  requested: {
    name: "Solicitadas",
    items: tasks
  },
  toDo: {
    name: "A Fazer",
    items: []
  },
};

// Função chamada quando uma tarefa é arrastada e solta
const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};

// Componente principal da aplicação
function App() {
  // Estado que mantém o estado das colunas e suas tarefas
  const [columns, setColumns] = useState(taskStatus);

  // Renderização da interface
  return (
    // Componente principal, representa o quadro Jira
    <div>
      {/* Título do quadro centralizado */}
      <h1 style={{ textAlign: "center" }}>Quadro Jira</h1>
  
      {/* Container flexível centralizado verticalmente */}
      <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
        {/* Componente DragDropContext do react-beautiful-dnd */}
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {/* Mapeando e renderizando cada coluna e suas tarefas */}
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              // Container de cada coluna
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
                key={columnId}
              >
                {/* Título da coluna */}
                <h2>{column.name}</h2>
  
                {/* Espaçamento abaixo do título */}
                <div style={{ margin: 8 }}>
                  {/* Componente Droppable do react-beautiful-dnd */}
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        // Container onde as tarefas podem ser soltas
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver ? "white" : "white",
                            padding: 4,
                            width: 250,
                            minHeight: 500,
                            border: "2px solid black",
                            borderRadius: 4, // Se desejar cantos arredondados, ajuste conforme necessário
                          }}
                        >
                          {/* Mapeando e renderizando cada tarefa dentro da coluna */}
                          {column.items.map((item, index) => {
                            return (
                              // Componente Draggable do react-beautiful-dnd
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    // Container de cada tarefa
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        padding: 16,
                                        margin: "0 0 8px 0",
                                        minHeight: "50px",
                                        backgroundColor: "white",
                                        color: "black",
                                        ...provided.draggableProps.style,
                                        border: "2px solid black", // Adiciona uma borda de 2 pixels sólidos pretos
                                        borderRadius: 4, // Ajuste conforme necessário para cantos arredondados
                                      }}
                                    >
                                      {/* Conteúdo da tarefa */}
                                      {item.content}
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {/* Marcador de posição para a área de soltar */}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
        }
// Exportando o componente principal
export default App;