import React, { useEffect, useState } from "react";
import BugLoading from "@core/BugLoading";
import { useApiPoller } from "@hooks/ApiPoller";

import ReactFlow, { addEdge, Background, useNodesState, useEdgesState } from "react-flow-renderer/nocss";
import "react-flow-renderer/dist/style.css";
import "./map.css";

import HostCard from "./../components/HostCard";
import AxiosPut from "@utils/AxiosPut";

const reactFlowStyle = {
    "& reactFlow__nodeDefault": { stroke: "red", padding: 0, width: "auto" },
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

    const isAnimated = (sourceId, targetId) => {
        for (let host of hosts) {
            if (host.hostId === sourceId || host.hostId === targetId) {
                if (!host.alive) {
                    return false;
                }
            }
        }
        return true;
    };

    useEffect(() => {
        if (hosts?.length > 0) {
            const nodes = hosts.map((host) => {
                return {
                    type: "input",
                    id: host.hostId,
                    data: { label: <HostCard {...host} /> },
                    position: host?.position,
                };
            });
            setNodes(nodes);
        }
    }, [hosts]);

    useEffect(() => {
        AxiosPut(`/container/${panelId}/edges`, { edges: edges });
    }, [edges]);

    useEffect(() => {
        if (edgesData) {
            const parsedEdges = [];
            for (const edgeId in edgesData) {
                parsedEdges.push({
                    id: edgeId,
                    source: edgesData[edgeId].source,
                    target: edgesData[edgeId].target,
                    animated: isAnimated(edgesData[edgeId].source, edgesData[edgeId].target),
                    type: "smoothstep",
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
                connectionMode="loose"
            >
                <Background gap={16} />
            </ReactFlow>
        </>
    );
}

export default function MapPanel({ panelId }) {
    const hosts = useApiPoller({
        url: `/container/${panelId}/hosts/`,
        interval: 3000,
    });

    const edges = useApiPoller({
        url: `/container/${panelId}/edges/`,
        interval: 3000,
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
