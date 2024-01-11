import React, { useEffect, useState } from 'react'
import { Row, Col, Image, Button, Modal, Form, Card as BootstrapCard, Dropdown, Offcanvas, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import ApiRequest from '../../api-call/apiRequest';

export default function Navbar() {
    let navigate = useNavigate()
    const [sginUpModal, setSginUpModal] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState("")
    const [useName, setUseName] = useState("")

    useEffect(() => {
        let userDetails = JSON.parse(localStorage.getItem('userDetails'))
        if (userDetails?.name) setUseName(userDetails?.name)
    }, [])



    const [validationError, setValidationError] = useState({
        name: "",
        email: ""
    })

    const validateForm = () => {
        let errorCount = 0
        if (name === "") {
            validationError.name = "Name is required"
            errorCount += 1
        } else validationError.name = ""

        if (email === "") {
            validationError.email = "Email is required"
            errorCount += 1
        } else validationError.email = ""

        setValidationError({ ...validationError })

        if (errorCount > 0) return false
        else return true
    }

    const generateUniqueRandomNumbers = (count, min, max) => {
        if (count > max - min + 1) {
            throw new Error("Cannot generate more unique numbers than the available range");
        }

        const numbers = Array.from({ length: max - min + 1 }, (_, index) => index + min);

        for (let i = numbers.length - 1; i > numbers.length - count - 1; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        return numbers.slice(numbers.length - count);
    }

    const getRandomItems = (array, count) => {
        // Fisher-Yates shuffle
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        // Take the first 'count' elements
        return array.slice(0, count);
    }

    const handleSginUp = async (mode = 'generate') => {
        if (!validateForm() && mode === 'generate') {
            return;
        }
        let userDetails = {
            name, email
        }

        let cardTypes = ['agents', 'weapons', 'sprays']
        let tempCards = []

        for (let i = 0; i < cardTypes.length; i++) {
            let data
            switch (cardTypes[i]) {
                case 'agents':
                    data = await ApiRequest('/agents?isPlayableCharacter=true')
                    break;
                case 'weapons':
                    data = await ApiRequest('/weapons')
                    break;
                case 'sprays':
                    data = await ApiRequest('/sprays')
                    break;
                default:
                    continue;
            }
            let tempData = data?.data?.data
            if (cardTypes[i] === 'sprays') {
                tempData = getRandomItems(tempData, 18);
            }
            const cardsWithPoints = tempData.map((card) => ({
                ...card,
                type: cardTypes[i],
                point: Math.floor(Math.random() * 10) + 1,
            }));
            tempCards.push(...cardsWithPoints)

        }

        const randomIndices = generateUniqueRandomNumbers(5, 1, tempCards.length);
        let cards = []
        for (let i = 0; i < randomIndices.length; i++) {
            cards.push(tempCards[randomIndices[i]]);
        }

        if (mode != 'regenerate') localStorage.setItem('userDetails', JSON.stringify(userDetails))
        localStorage.setItem('cards', JSON.stringify(cards))
        setSginUpModal(false);
        window.location.reload();
    }

    const handleSginOut = () => {
        localStorage.clear();
        window.location.reload();
    }
    return (
        <div className='mx-5 pt-5'>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" style={{ color: '#FF4654' }} href="/"><h3>Valorant</h3></a>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav  mx-4">
                            <li className="nav-item mx-1">
                                <a style={{ color: '#FF4654', fontSize: '1.3rem' }} className="nav-link active" aria-current="page" href="/">Home</a>
                            </li>
                            <li className="nav-item">
                                <a style={{ color: '#FF4654', fontSize: '1.3rem' }} className="nav-link" href="/trade">Trade</a>
                            </li>
                        </ul>
                    </div>
                    {useName ?
                        (
                            <div className='d-flex align-items-center'>
                                <h5 style={{ color: '#FF4654' }}>Hello, {useName}</h5>

                                <OverlayTrigger placement="top" overlay={
                                    <Tooltip >Regenerate cards</Tooltip>
                                }>
                                    <div>

                                        <button className="btn btn-outline-warning mx-4" onClick={() => handleSginUp('regenerate')} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M20 128a76.08 76.08 0 0 1 76-76h99l-3.52-3.51a12 12 0 1 1 17-17l24 24a12 12 0 0 1 0 17l-24 24a12 12 0 0 1-17-17L195 76H96a52.06 52.06 0 0 0-52 52a12 12 0 0 1-24 0m204-12a12 12 0 0 0-12 12a52.06 52.06 0 0 1-52 52H61l3.52-3.51a12 12 0 1 0-17-17l-24 24a12 12 0 0 0 0 17l24 24a12 12 0 1 0 17-17L61 204h99a76.08 76.08 0 0 0 76-76a12 12 0 0 0-12-12" /></svg>
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleSginOut()} >Sgin Out</button>
                                    </div>
                                </OverlayTrigger>
                            </div>
                        )
                        :
                        (
                            <button class="btn btn-danger" onClick={() => setSginUpModal(true)} >Sgin Up</button>
                        )
                    }
                </div>
            </nav>
            <Modal show={sginUpModal} onHide={() => setSginUpModal(false)}>
                <Modal.Header closeButton style={{
                    // backgroundColor: 'black'
                    backgroundImage: 'url("https://w0.peakpx.com/wallpaper/280/848/HD-wallpaper-video-game-valorant-logo.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '10vh' // Adjust the height as needed
                }}>
                    <div className='d-flex align-items-center justify-content-between'>
                        <h5 style={{ color: 'white' }} className=''> Sgin Up To Start Trade
                        </h5>
                    </div>
                </Modal.Header>
                <Modal.Body style={{
                    // backgroundColor: 'black'
                    backgroundImage: 'url("https://w0.peakpx.com/wallpaper/280/848/HD-wallpaper-video-game-valorant-logo.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '25vh' // Adjust the height as needed
                }}>
                    <div className="row">
                        <Form.Group className="form-group col-md-12">
                            <Form.Label htmlFor="lname">Name<span className="text-danger"><small>*</small></span></Form.Label>
                            <Form.Control value={name} onChange={(event) => { setName(event.target.value) }} type="text" id="lname" placeholder="name" />
                            {validationError.name === "" ? (<></>) : (<p className="text-danger"><small>{validationError.name}</small></p>)}
                        </Form.Group>

                        <Form.Group className="form-group col-md-12">
                            <Form.Label htmlFor="lname">Email<span className="text-danger"><small>*</small></span></Form.Label>
                            <Form.Control value={email} onChange={(event) => { setEmail(event.target.value) }} type="text" id="lname" placeholder="email" />
                            {validationError.email === "" ? (<></>) : (<p className="text-danger"><small>{validationError.email}</small></p>)}
                        </Form.Group>

                    </div>
                </Modal.Body>
                <Modal.Footer style={{
                    // backgroundColor: 'black'
                    backgroundImage: 'url("https://w0.peakpx.com/wallpaper/280/848/HD-wallpaper-video-game-valorant-logo.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '10vh' // Adjust the height as needed
                }}>
                    <button onClick={() => setSginUpModal(false)} className='btn btn-outline-secondary'>
                        Cancel
                    </button>
                    <Button onClick={() => handleSginUp()} variant="danger">
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
