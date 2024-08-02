import React, { useState, useEffect } from 'react';
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import axiosInstance from '../services/axiosSetup'; // Assurez-vous que ce chemin est correct

const FamilyDiagram = () => {
  const [nodeDataArray, setNodeDataArray] = useState([]);
  const [linkDataArray, setLinkDataArray] = useState([]);

  useEffect(() => {
    const fetchFamilyData = async () => {
      try {
        const response = await axiosInstance.get('/membres/tous');
        console.log('Données reçues:', response.data); // Vérifiez les données reçues

        if (!response.data) {
          throw new Error('Aucune donnée reçue');
        }

        const members = response.data;

        const nodes = members.map(member => ({
          key: member._id,
          text: `${member.prenom} ${member.nom}`,
          color: 'lightblue',
          loc: '0 0' // Vous pouvez ajuster la position initiale si nécessaire
        }));

        const links = members.flatMap(member => {
          const links = [];
          if (member.id_pere) {
            links.push({ key: `link-${member._id}-pere`, from: member.id_pere, to: member._id, text: 'Père' });
          }
          if (member.id_mere) {
            links.push({ key: `link-${member._id}-mere`, from: member.id_mere, to: member._id, text: 'Mère' });
          }
          return links;
        });

        setNodeDataArray(nodes);
        setLinkDataArray(links);
      } catch (error) {
        console.error('Erreur lors de la récupération des données familiales:', error);
      }
    };

    fetchFamilyData();
  }, []);

  function initDiagram() {
    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, {
      'undoManager.isEnabled': true,
      'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
      model: $(go.GraphLinksModel, {
        linkKeyProperty: 'key'
      })
    });

    // Template de nœud
    diagram.nodeTemplate = $(
      go.Node,
      'Auto',
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      $(
        go.Shape,
        'RoundedRectangle',
        { name: 'SHAPE', fill: 'white', strokeWidth: 0 },
        new go.Binding('fill', 'color')
      ),
      $(
        go.TextBlock,
        { margin: 8, editable: true },
        new go.Binding('text').makeTwoWay()
      )
    );

    // Template de lien
    diagram.linkTemplate = $(
      go.Link,
      { curve: go.Link.Bezier },
      $(
        go.Shape,
        { strokeWidth: 2, stroke: '#555' }
      ),
      $(
        go.TextBlock,
        { segmentOffset: new go.Point(0, -10) },
        new go.Binding('text')
      )
    );

    // Configurer le TreeLayout
    diagram.layout = new go.TreeLayout({ angle: 90 });

    return diagram;
  }

  

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactDiagram
        initDiagram={initDiagram}
        divClassName='diagram-component'
        nodeDataArray={nodeDataArray}
        linkDataArray={linkDataArray}
       
      />
    </div>
  );
};

export default FamilyDiagram;