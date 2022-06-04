import React, { useEffect, useState } from "react";
import BugLoading from "@core/BugLoading";
import { useApiPoller } from "@hooks/ApiPoller";

import ReactFlow, { addEdge, Background, useNodesState, useEdgesState } from "react-flow-renderer/nocss";
import "react-flow-renderer/dist/style.css";
import "./map.css";

import HostCard from "./../components/HostCard";
import AxiosPut from "@utils/AxiosPut";

const reactFlowStyle = {
    "& react-flow__node-default": { stroke: "red", padding: 0, width: "auto" },
};

function FlowDiagram({ hosts, edgesData, panelId }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [rfInstance, setRfInstance] = useState(null);
    const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

    const onInit = (reactFlowInstance) => {
        setRfInstance(reactFlowInstance);
    };

    const updateHostPositsion = async (hostId, position) => {
        const response = await AxiosPut(`/container/${panelId}/hosts/${hostId}`, { position: position });
        if (!response) {
            sendAlert(`Could not move host`, { variant: "error" });
        }
    };

    useEffect(() => {
        if (hosts?.length > 0) {
            const nodes = hosts.map((host) => {
                let position = host?.position;
                if (!position) {
                    position = { x: Math.random() * 500, y: Math.random() * 500 };
                }

                return {
                    id: host.hostId,
                    data: { label: <HostCard {...host} /> },
                    position: position,
                };
            });
            setNodes(nodes);
        }
    }, [hosts]);

    useEffect(() => {
        if (edgesData) {
            const parsedEdges = [];
            for (const edgeId in edgesData) {
                parsedEdges.push({
                    id: edgeId,
                    source: edgesData[edgeId].source,
                    target: edgesData[edgeId].target,
                    animated: true,
                });
            }
            setEdges(parsedEdges);
        }
    }, [edgesData]);

    return (
        <>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeDragStop={(event, node) => {
                    updateHostPositsion(node?.id, node?.position);
                }}
                onConnect={onConnect}
                onInit={onInit}
                style={reactFlowStyle}
                fitView
                attributionPosition="bottom-right"
            >
                <Background gap={16} />
            </ReactFlow>
        </>
    );
}

export default function MapPanel({ panelId }) {
    const hosts = useApiPoller({
        url: `/container/${panelId}/hosts/`,
        interval: 5000,
    });

    const edges = useApiPoller({
        url: `/container/${panelId}/edges/`,
        interval: 5000,
    });

    if (
        hosts.status === "loading" ||
        hosts.status === "idle" ||
        edges.status === "loading" ||
        edges.status === "idle"
    ) {
        return <BugLoading />;
    }
    return <FlowDiagram panelId={panelId} hosts={hosts.data} edgesData={edges.data} />;
}
