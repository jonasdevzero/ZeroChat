import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { ContactI, UserI } from "../types/user";

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
    socket: SocketIOClient.Socket;
    startingCall: boolean;
    receivingCall: boolean;
    callTo: ContactI;
    callFrom: ContactI;
    callerSignal: any;
};

export default function Call({ socket, callTo, callFrom, startingCall, receivingCall, callerSignal }: ICall) {
    const myVideo = useRef(null);
    const userVideo = useRef(null);

    const [mediaLoaded, setMediaLoaded] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);

    useEffect(() => {
        if (myVideo && startingCall) {
            console.log("Starting a call to", callTo);
            callUser(callTo.id);
        };
    }, [myVideo]);

    function callUser(to: string) {
        const peer = new Peer({ initiator: true });

        peer.on("signal", signal => {
            socket.emit("callRequest", { signal, to }, (sent: boolean) => { });
        });

        peer.on("stream", stream => {
            console.log("receiving the stream");
            userVideo.current.srcObject = stream;
        });

        socket.on("callAccepted", signal => {
            console.log("receiving a signal", signal)
            setCallAccepted(true);
            peer.signal(signal);
        });

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            setMediaLoaded(true);
            myVideo.current.srcObject = stream;
            peer.addStream(stream);
        });
    };

    function answerCall() {
        setCallAccepted(true);

        const peer = new Peer({ initiator: false });

        peer.on("signal", signal => {
            console.log("Emiting my signal ", callFrom)
            socket.emit("answerCall", { signal, to: callFrom.id });
        });

        peer.on("stream", stream => {
            console.log("receiving the stream");
            userVideo.current.srcObject = stream;
        });

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            setMediaLoaded(true);
            myVideo.current.srcObject = stream;
            peer.addStream(stream);
        });

        peer.signal(callerSignal);
    };

    return (
        <Container>
            <UsersContainer>
                {receivingCall && !callAccepted ? (
                    <ReceivingCallContainer>
                        <Avatar src={callFrom?.image} />

                        <h1>{callFrom?.username} is calling...</h1>

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
