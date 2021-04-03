import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { ContactI, UserI } from "../types/user";
import { socket } from '../services';

import {
    Container,
    UsersContainer,
    UserVideo,
    UserLoading,
    InfoBar,
    ReceivingCallContainer,
    Buttons,
} from "../styles/components/Call";
import { Avatar, IconButton } from "@material-ui/core";
import { Call as CallIcon, CallEnd as CallEndIcon } from "@material-ui/icons";

interface ICall {
    userCall: ContactI
    callerSignal: any;
    startingOrReceivingCall: 'receiving' | 'starting'
};

export default function Call({ userCall, callerSignal, startingOrReceivingCall }: ICall) {
    const myVideo = useRef(null);
    const userVideo = useRef(null);

    const [mediaLoaded, setMediaLoaded] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);

    useEffect(() => {
        if (myVideo && startingOrReceivingCall === 'starting') {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
                setMediaLoaded(true);
                myVideo.current.srcObject = stream;

                callUser(userCall.id, stream);
            });
        };
    }, [myVideo]);

    function callUser(to: string, stream: MediaStream) {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on("signal", signal => {
            socket.emit("callRequest", { signal, to }, (sent: boolean) => { });
        });

        peer.on("stream", stream => {
            userVideo.current.srcObject = stream;
        });

        socket.on("callAccepted", signal => {
            setCallAccepted(true);
            peer.signal(signal);
        });
    };

    function answerCall() {
        setCallAccepted(true);

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            const peer = new Peer({ initiator: false, trickle: false, stream });

            peer.on("signal", signal => {
                socket.emit("answerCall", { signal, to: userCall.id });
            });

            peer.on("stream", stream => {
                userVideo.current.srcObject = stream;
            });

            setMediaLoaded(true);
            myVideo.current.srcObject = stream;

            peer.signal(callerSignal);
        });
    };

    return (
        <Container>
            <UsersContainer>
                {startingOrReceivingCall === 'receiving' && !callAccepted ? (
                    <ReceivingCallContainer>
                        <Avatar src={userCall?.image} />

                        <h1>{userCall?.username} is calling...</h1>

                        <Buttons>
                            <IconButton onClick={() => answerCall()}>
                                <CallIcon className="call" />
                            </IconButton>

                            <IconButton onClick={() => { }}>
                                <CallEndIcon className="callend" />
                            </IconButton>
                        </Buttons>
                    </ReceivingCallContainer>
                ) : null}

                {mediaLoaded ? (
                    <UserVideo ref={myVideo} playsInline muted autoPlay />
                ) : (
                    <UserLoading>
                        <img src="/loading-light.svg" alt="loading" />
                    </UserLoading>
                )}

                {callAccepted ? (<UserVideo ref={userVideo} autoPlay />) : null}
            </UsersContainer>

            <InfoBar>
                <Buttons>
                    <button type="button">Call end</button>
                </Buttons>
            </InfoBar>
        </Container>
    );
};
