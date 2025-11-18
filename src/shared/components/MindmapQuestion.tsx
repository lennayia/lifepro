/**
 * MindmapQuestion Component
 * Interaktivní mindmapa pro otázky typu "mindmap"
 */

'use client';

import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Paper,
  Typography,
  Tooltip,
} from '@mui/material';
import { Plus, Trash2, Save } from 'lucide-react';

interface MindmapQuestionProps {
  initialData?: {
    nodes: Node[];
    edges: Edge[];
  };
  onChange?: (data: { nodes: Node[]; edges: Edge[] }) => void;
  readOnly?: boolean;
}

const MindmapQuestion: React.FC<MindmapQuestionProps> = ({
  initialData,
  onChange,
  readOnly = false,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialData?.nodes || [
      {
        id: '1',
        type: 'default',
        position: { x: 250, y: 100 },
        data: { label: 'Hlavní téma' },
        style: {
          background: '#667eea',
          color: 'white',
          border: '2px solid #764ba2',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '14px',
          fontWeight: 'bold',
        },
      },
    ]
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData?.edges || []);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeLabel, setNodeLabel] = useState('');

  // Notifikace změn parent komponentě
  useEffect(() => {
    if (onChange) {
      onChange({ nodes, edges });
    }
  }, [nodes, edges, onChange]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (readOnly) return;
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#764ba2',
            },
            style: {
              stroke: '#764ba2',
              strokeWidth: 2,
            },
          },
          eds
        )
      );
    },
    [setEdges, readOnly]
  );

  const addNode = () => {
    if (readOnly) return;

    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'default',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      data: { label: 'Nový uzel' },
      style: {
        background: '#ffffff',
        border: '2px solid #667eea',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '13px',
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const deleteSelectedNode = () => {
    if (!selectedNode || readOnly) return;

    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id)
    );
    setSelectedNode(null);
    setNodeLabel('');
  };

  const updateNodeLabel = () => {
    if (!selectedNode || !nodeLabel.trim()) return;

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === selectedNode.id) {
          return {
            ...n,
            data: {
              ...n.data,
              label: nodeLabel,
            },
          };
        }
        return n;
      })
    );

    setSelectedNode(null);
    setNodeLabel('');
  };

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (readOnly) return;
      setSelectedNode(node);
      setNodeLabel(node.data.label as string);
    },
    [readOnly]
  );

  return (
    <Box>
      <Paper
        elevation={3}
        sx={{
          height: 500,
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          border: '2px solid',
          borderColor: 'primary.main',
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={readOnly ? undefined : onNodesChange}
          onEdgesChange={readOnly ? undefined : onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#f0f0f0" gap={16} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              if (node.id === '1') return '#667eea';
              return '#ffffff';
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />

          {!readOnly && (
            <Panel position="top-right">
              <Box display="flex" flexDirection="column" gap={1}>
                <Tooltip title="Přidat nový uzel">
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Plus size={16} />}
                    onClick={addNode}
                  >
                    Přidat uzel
                  </Button>
                </Tooltip>

                {selectedNode && (
                  <Tooltip title="Smazat vybraný uzel">
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Trash2 size={16} />}
                      onClick={deleteSelectedNode}
                    >
                      Smazat
                    </Button>
                  </Tooltip>
                )}
              </Box>
            </Panel>
          )}
        </ReactFlow>
      </Paper>

      {/* Editor pro vybraný uzel */}
      {selectedNode && !readOnly && (
        <Box mt={2}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Upravit text uzlu:
            </Typography>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                size="small"
                value={nodeLabel}
                onChange={(e) => setNodeLabel(e.target.value)}
                placeholder="Text uzlu..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    updateNodeLabel();
                  }
                }}
              />
              <Button
                variant="contained"
                startIcon={<Save size={16} />}
                onClick={updateNodeLabel}
              >
                Uložit
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setSelectedNode(null);
                  setNodeLabel('');
                }}
              >
                Zrušit
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Nápověda */}
      {!readOnly && (
        <Box mt={2}>
          <Typography variant="caption" color="text.secondary">
            💡 <strong>Tip:</strong> Klikněte na uzel pro úpravu textu. Táhněte z
            jednoho uzlu na druhý pro vytvoření propojení. Používejte kolečko myši pro
            zoom.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MindmapQuestion;
