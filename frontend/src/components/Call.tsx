import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { ContactI } from "../types/user";
import { socket } from '../services';

import {
    Container,
    UsersContainer,
    UserVideo,
    LoadingMedia,
    ReceivingCall,
    Calling,
    InfoBar,
    Buttons,
    Button,
} from "../styles/components/Call";
import { Avatar } from "@material-ui/core";
import {
    Call as CallIcon,
    CallEnd as CallEndIcon,
    Mic as MicIcon,
    MicOff as MicOffIcon,
    Videocam as VideocamIcon,
    VideocamOff as VideocamOffIcon,
    ArrowDropDown as ArrowDropDownIcon,
} from "@material-ui/icons";

interface ICall {
    userCall: ContactI
    callerSignal: any;
    startingOrReceivingCall: 'receiving' | 'starting';
    callType: 'video' | 'audio';
    setCallMinimized: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Call({ userCall, callerSignal, startingOrReceivingCall, callType, setCallMinimized }: ICall) {
    const myVideo = useRef(null);
    const userVideo = useRef(null);

    const [mediaLoaded, setMediaLoaded] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);

    const [myStream, setMyStream] = useState<MediaStream>(undefined);

    const [videoEnabled, setVideoEnabled] = useState(callType === 'video');
    const [audioEnabled, setAudioEnabled] = useState(true);

    useEffect(() => {
        if (myVideo && startingOrReceivingCall === 'starting') {
            callUser(userCall.id);
        };
    }, [myVideo]);

    function callUser(to: string) {
        navigator.mediaDevices.getUserMedia({ video: callType === 'video', audio: true }).then(stream => {
            setMyStream(stream);

            const peer = new Peer({ initiator: true, stream, trickle: false });

            peer.on("signal", signal => {
                socket.emit("callRequest", { signal, to, callType }, () => {
                    setMediaLoaded(true);
                });
            });

            peer.on('stream', stream => {
                userVideo.current.srcObject = stream;
            });

            socket.on("callAccepted", signal => {
                setCallAccepted(true);
                myVideo.current.srcObject = stream;

                peer.signal(signal);
            });
        });
    };

    function answerCall() {
        setCallAccepted(true);

        navigator.mediaDevices.getUserMedia({ video: callType === 'video', audio: true }).then(stream => {
            setMediaLoaded(true);
            setMyStream(stream);
            myVideo.current.srcObject = stream;

            const peer = new Peer({ initiator: false, stream, trickle: false });

            peer.on("signal", signal => {
                socket.emit("answerCall", { signal, to: userCall.id });
            });

            peer.on('stream', stream => {
                userVideo.current.srcObject = stream;
            });

            peer.signal(callerSignal);
        });
    };

    function toggleMicStatus() {
        const enabled = myStream.getAudioTracks()[0].enabled;

        myStream.getAudioTracks()[0].enabled = !enabled;
        setAudioEnabled(!enabled);
    };

    function toggleVideoStatus() {
        const enabled = myStream.getVideoTracks()[0].enabled;

        myStream.getVideoTracks()[0].enabled = !enabled;
        setVideoEnabled(!enabled);
    };

    return (
        <Container>
            <UsersContainer>
                {function () {
                    switch (startingOrReceivingCall) {
                        case 'starting':
                            if (!mediaLoaded) {
                                return (
                                    <LoadingMedia>
                                        <img src="/loading-light.svg" alt="loading" />
                                        <span>Loading media</span>
                                    </LoadingMedia>
                                );
                            } else if (mediaLoaded && !callAccepted) {
                                return (
                                    <Calling>
                                        <Avatar src={userCall?.image} />
                                        <span>Calling to {userCall?.username}</span>

                                        <Buttons>
                                            <Button>
                                                <CallEndIcon className='callend' />
                                            </Button>
                                        </Buttons>
                                    </Calling>
                                );
                            };
                        case 'receiving':
                            if (!callAccepted) {
                                return (
                                    <ReceivingCall>
                                        <Avatar src={userCall?.image} />

                                        <span>{userCall?.username} is calling</span>

                                        <Buttons>
                                            <Button onClick={() => answerCall()}>
                                                <CallIcon className="call" />
                                            </Button>

                                            <Button onClick={() => { }}>
                                                <CallEndIcon className="callend" />
                                            </Button>
                                        </Buttons>
                                    </ReceivingCall>
                                );
                            } else if (callAccepted && !mediaLoaded) {
                                return (
                                    <LoadingMedia>
                                        <img src="/loading-light.svg" alt="loading" />
                                        <span>Loading media</span>
                                    </LoadingMedia>
                                );
                            };
                    };
                }()}

                {mediaLoaded && callAccepted ? (
                    <>
                        <UserVideo ref={myVideo} playsInline muted autoPlay />
                        <UserVideo ref={userVideo} autoPlay />
                    </>
                ) : null}
            </UsersContainer>

            {callAccepted && mediaLoaded ? (
                <InfoBar>
                    <Buttons>
                        <Button className='no-bg' onClick={() => setCallMinimized(true)}>
                            <ArrowDropDownIcon />
                        </Button>

                        <Button className='no-bg' onClick={() => toggleVideoStatus()}>
                            {videoEnabled ? (<VideocamIcon />) : (<VideocamOffIcon />)}
                        </Button>

                        <Button>
                            <CallEndIcon className='callend' />
                        </Button>

                        <Button className='no-bg' onClick={() => toggleMicStatus()}>
                            {audioEnabled ? (<MicIcon />) : (<MicOffIcon />)}
                        </Button>
                    </Buttons>
                </InfoBar>
            ) : null}
        </Container>
    );
};
