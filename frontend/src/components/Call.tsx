import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";

import {
    Container,
    UsersContainer,
    UserVideo,
    InfoBar
} from "../styles/components/Call";

interface CallI {
    socket: any;
};

const callRoom = "zero";

function Video(props) {
    const ref = useRef(null);

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        });
    }, []);

    return (
        <UserVideo ref={ref} autoPlay playsInline />
    );
};

export default function Call({ socket }: CallI) {
    const userVideo = useRef(null);

    const [peers, setPeers] = useState([]);

    useEffect(() => {
        if (userVideo.current) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
                userVideo.current.srcObject = stream;
                const peersUpdated = [];

                socket.emit("joinInCall", callRoom);

                socket.on("usersInCall", (users) => {
                    users.forEach(userId => {

                    });
                });
            });
        };
    }, [userVideo.current]);

    function createPeer(userId: string, callerId: string, stream: MediaStream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socket.emit("sending signal", { callerId, userId, signal })
        });

        return peer;
    };

    function addPeer(incomingSignal: string, callerId: string, stream: MediaStream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socket.emit("returning signal", { signal, callerId })
        });

        peer.signal(incomingSignal);

        return peer;
    };

    return (
        <Container>
            <UsersContainer>
                <UserVideo ref={userVideo} autoPlay playsInline />

                {peers.map((peer, i) => {
                    return (
                        <Video key={i} peer={peer} />
                    );
                })}
            </UsersContainer>

            <InfoBar>
                qetrhwhytjwrhq44hq4y
            </InfoBar>
        </Container>
    );
};
