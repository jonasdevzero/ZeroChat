import Head from 'next/head'
import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { userService } from "../services"
import { useWarn, useTheme } from '../hooks'

import { Header, Footer } from "../components"
import {
    Container,
    Inner,
    Form,
    FormTitle,
    InputWrapper,
    Label,
    Input,
    Submit,
    Links,
    RedirectLink,
    FormStepProgress,
    FormStepBack,
    ErrorMessage,
} from "../styles/pages/base"
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

export default function SignUp() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    const [currentStep, setCurrentStep] = useState(0)
    const [error, setError] = useState(undefined)
    const [loadingRequest, setLoadingRequest] = useState(false)

    const router = useRouter()
    const warn = useWarn()
    const [theme] = useTheme()

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setError(undefined)
        setLoadingRequest(true)
        userService.subscribe({ username, password, confirmPassword, name, email })
            .then(handleSucess)
            .catch(handleError)
            .then(() => setLoadingRequest(false))
    }

    function handleSucess() {
        setCurrentStep(3)
        warn.success('Welcome to  Zero')
        setTimeout(() => router.push('/chat'), 2500)
    }

    function handleError(message: string) {
        setError(message)
        message.split(' ')[0].toLowerCase() == 'email' ? setCurrentStep(1) : setCurrentStep(0)
    }

    return (
        <Container>
            <Head>
                <title>Zero | Sign Up</title>
            </Head>

            <Header />

            <Inner>
                <Form onSubmit={handleSubmit}>
                    <FormTitle>Sign Up</FormTitle>

                    {error && (<ErrorMessage>{error}</ErrorMessage>)}

                    {currentStep === 0 ? (
                        <>
                            <InputWrapper>
                                <Label htmlFor='username'>Username</Label>
                                <Input required id='username' type='text' value={username} onChange={e => setUsername(e.target.value)} />
                            </InputWrapper>

                            <InputWrapper>
                                <Label htmlFor='password'>Password</Label>
                                <Input required id='password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
                            </InputWrapper>

                            <InputWrapper>
                                <Label htmlFor='confirmPassword'>Confirm Password</Label>
                                <Input required id='confirmPassword' type='password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                            </InputWrapper>

                            <Submit type='button' onClick={() => setCurrentStep(1)}>Next</Submit>
                        </>
                    ) : currentStep >= 1 ? (
                        <>
                            <InputWrapper>
                                <Label htmlFor='name'>Name</Label>
                                <Input required id='name' type='text' value={name} onChange={e => setName(e.target.value)} />
                            </InputWrapper>

                            <InputWrapper>
                                <Label htmlFor='email'>E-mail</Label>
                                <Input required id='email' type='text' value={email} onChange={e => setEmail(e.target.value)} />
                            </InputWrapper>

                            <Submit type='submit'>
                                {!loadingRequest ? 'Sign Up' : (<img src={`/loading-${theme === 'dark' ? 'light' : 'dark'}.svg`} />)}
                            </Submit>
                        </>
                    ) : null}

                    <Links>
                        <Link href='/signin'>
                            <RedirectLink>Already a member?</RedirectLink>
                        </Link>
                    </Links>

                    {currentStep > 0 ? (
                        <FormStepBack onClick={() => setCurrentStep(currentStep - 1)}>
                            <ArrowBackIosIcon fontSize='large' />
                        </FormStepBack>
                    ) : null}

                    <FormStepProgress step={currentStep} />
                </Form>
            </Inner>

            <Footer />
        </Container>
    )
}
