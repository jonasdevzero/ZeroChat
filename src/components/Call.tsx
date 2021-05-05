import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { socket } from '../services';
import { useSelector, useDispatch } from 'react-redux'
import { toggleCallMinimized } from '../store/actions/call'

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
    CallTime,
    Message,
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

export default function Call() {
    const myVideo = useRef(null);
    const userVideo = useRef(null);

    const call = useSelector((state: any) => state.call)
    const dispatch = useDispatch()

    const [mediaLoaded, setMediaLoaded] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);

    const [myStream, setMyStream] = useState<MediaStream>(undefined);

    const [videoEnabled, setVideoEnabled] = useState(call?.type === 'video');
    const [audioEnabled, setAudioEnabled] = useState(true);

    const [callTime, setCallTime] = useState(0);

    const [alert, setAlert] = useState('');

    useEffect(() => call.startingOrReceiving === 'starting' ? callUser() : null, []);

    function callUser() {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            stream.getVideoTracks()[0].enabled = call.type === 'video';
            setMyStream(stream);

            const peer = new Peer({ initiator: true, stream, trickle: false });

            peer.on("signal", signal => {
                socket.emit("call-request", { signal, to: call.userCall.id, callType: call.type }, () => setMediaLoaded(true));
            });

            peer.on('stream', stream => userVideo.current.srcObject = stream);

            peer.on('error', (error) => { });

            socket.on("call-accepted", signal => {
                setCallAccepted(true);
                startCallTime();
                myVideo.current.srcObject = stream;

                peer.signal(signal);
            });

            socket.on('call-rejected', () => {
                setAlert('Call rejected');
            });
        });
    };

    function answerCall() {
        setCallAccepted(true);

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            stream.getVideoTracks()[0].enabled = call.type === 'video';
            setMediaLoaded(true);
            setMyStream(stream);
            myVideo.current.srcObject = stream;

            const peer = new Peer({ initiator: false, stream, trickle: false });

            peer.on("signal", signal => {
                socket.emit("call-answer", { signal, to: call.userCall.id });
                startCallTime();
            });

            peer.on('stream', stream => userVideo.current.srcObject = stream);

            peer.on('error', (error) => { });

            peer.signal(call.userSignal);
        });
    };

    function finishCall() {
        socket.emit('call-finished', { to: call.userCall.id }, () => {});
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

    function startCallTime() {
        let time = 0;
        setInterval(() => {
            time += 1
            setCallTime(time);
        }, 1000);
    };

    function convertSeconds(time: number) {
        const measuredTime = new Date(null);
        measuredTime.setSeconds(time);

        return measuredTime.toISOString().substr(11, 8);
    };

    return (
        <Container minimized={call.minimized}>
            <UsersContainer>
                {function () {
                    switch (call.startingOrReceiving) {
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
                                        <Avatar src={call.userCall.picture} />
                                        <span>Calling to {call.userCall.username}</span>

                                        <Buttons>
                                            <Button onClick={() => { }}>
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
                                        <Avatar src={call.userCall.picture} />

                                        <span>{call.userCall.username} is calling</span>

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

                {!!alert ? (
                    <Message>{alert}</Message>
                ) : null}

                {mediaLoaded && callAccepted ? (
                    <>
                        <UserVideo ref={myVideo} playsInline muted autoPlay />
                        <UserVideo ref={userVideo} autoPlay />
                    </>
                ) : null}
            </UsersContainer>

            {callAccepted && mediaLoaded ? (
                <InfoBar>
                    <Button className='no-bg' onClick={() => dispatch(toggleCallMinimized())}>
                        <ArrowDropDownIcon fontSize='large' />
                    </Button>

                    <Buttons>
                        <Button className='no-bg' onClick={() => toggleVideoStatus()}>
                            {videoEnabled ? (<VideocamIcon />) : (<VideocamOffIcon />)}
                        </Button>

                        <Button onClick={() => finishCall()}>
                            <CallEndIcon className='callend' />
                        </Button>

                        <Button className='no-bg' onClick={() => toggleMicStatus()}>
                            {audioEnabled ? (<MicIcon />) : (<MicOffIcon />)}
                        </Button>
                    </Buttons>

                    <CallTime>{convertSeconds(callTime)}</CallTime>
                </InfoBar>
            ) : null}
        </Container>
    );
};
