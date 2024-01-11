import React, { useEffect, useState } from 'react'
import ApiRequest from '../../../api-call/apiRequest'
import { Row, Col, Image, Button, Modal, Form, Card as BootstrapCard, Dropdown, Offcanvas, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './card.css'
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import LoaderComp from '../../../components/LoaderComp'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Cards({ type }) {
    const [Cards, setCards] = useState([])
    const [userCards, setUserCards] = useState([])
    const [tradeModal, setTradeModal] = useState(false)
    const [selectCard, setSelectCard] = useState()
    const [tradeCard, setTradeCard] = useState()
    const [selected, setSelected] = React.useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const isItemSelected = (id) => !!selected.find((el) => el.id === id);

    const fetchCards = async () => {
        setIsLoading(true);
        let data
        switch (type) {
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
                return;
        }

        let tempCards = data?.data?.data
        const cardsWithPoints = tempCards.map((card) => ({
            ...card,
            type,
            point: Math.floor(Math.random() * 10) + 1,
        }));

        setCards(cardsWithPoints);
        setIsLoading(false);
    }


    useEffect(() => {
        fetchCards();
    }, [])

    const handleCardClick = (card) => {
        setTradeModal(true);
        setSelectCard(card)
        let userCards = JSON.parse(localStorage.getItem('cards'))
        setUserCards(userCards);
    }

    const handleClick =
        (id, item) =>
            ({ getItemById, scrollToItem }) => {
                const itemSelected = isItemSelected(id);
                console.log("999999999999999999999999", itemSelected);
                console.log("111111111111111111111111111", selected);
                // if (selected[0] === id) setSelected([])
                // else setSelected([id]);
                setSelected((currentSelected) =>
                    itemSelected
                        ? currentSelected.filter((el) => el.id !== id)
                        : currentSelected.concat({ id, point: item.point })
                );
                setTradeCard(item)
            };


    const handleTrade = () => {
        let points = 0
        for (let i = 0; i < selected.length; i++) {
            points += selected[i].point
        }
        if (points != parseInt(selectCard.point)) {
            return toast.error("Point's should be equal to trade!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
        }
        let cardIdx = [];
        for (let i = 0; i < userCards.length; i++) {
            if (selectCard?.uuid === userCards[i]?.uuid) return toast.error("You already owe this card", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
            // if (tradeCard?.uuid === userCards[i]?.uuid) cardIdx.push(i);
            for (let j = 0; j < selected.length; j++) {
                if (selected[j].id === userCards[i]?.uuid) {
                    userCards.splice(i, 1)
                }
            }
        }

        userCards.push(selectCard)
        if (cardIdx.length > 1) {
            for (let i = 0; i < cardIdx.length; i++) {
                if (i === 0) continue;
                userCards.splice(i, 1)
            }
        }
        setSelected([]);
        setUserCards([...userCards]);
        localStorage.setItem('cards', JSON.stringify(userCards));
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {isLoading ?
                (
                    <div className='d-flex align-items-center justify-content-center my-5 py-5'>
                        <LoaderComp />
                    </div>
                )
                :
                (
                    <div className='mx-5 px-5' style={{
                    }}>
                        <h1 style={{ color: '#FF4654' }}>{type === 'agents' ? 'Agents' : type === 'weapons' ? 'Weapons' : 'Sprays'}</h1>
                        <div className='d-flex flex-wrap'>
                            {Cards.map((item, idx) => (
                                <Link key={idx} onClick={() => { handleCardClick(item) }} className="card-body col-md-4">
                                    <div className="card" style={{ width: '18rem' }}>
                                        <div className='d-flex align-items-center' style={{ height: type === 'weapons' ? '9rem' : '15rem', backgroundImage: `url(${type === 'agents' ? item?.background : type === 'sprays' ? item.fullTransparentIcon : item.killStreamIcon})`, backgroundSize: 'cover' }}>
                                            <img src={item?.displayIcon} className="card-img-top" alt="..." style={{ transition: 'transform 0.3s', width: '100%' }} />
                                        </div>
                                        <div className="card-body" style={{ backdropFilter: 'blur(100px)', height: '12rem', borderRadius: '10%' }} >
                                            <h2 style={{ fontWeight: 'bold' }} className="card-title">{item?.displayName}</h2>
                                            <p style={{ fontWeight: 'bold', fontSize: '1.5rem' }} className="card-text">Points: {item?.point}</p>
                                        </div>
                                    </div>
                                </Link>
                            )
                            )}

                        </div>

                        <Modal show={tradeModal} onHide={() => setTradeModal(false)} size="xl">
                            <Modal.Header
                                style={{
                                    // backgroundColor: 'black'
                                    backgroundImage: 'url("https://w0.peakpx.com/wallpaper/280/848/HD-wallpaper-video-game-valorant-logo.jpg")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    minHeight: '10vh' // Adjust the height as needed
                                }}
                                closeButton>
                                <div style={{
                                }}>
                                    <h5 className='mx-3' style={{ color: 'white' }}> Trade with your cards</h5>
                                </div>
                            </Modal.Header>
                            <Modal.Body style={{
                                // backgroundColor: 'black'
                                backgroundImage: 'url("https://w0.peakpx.com/wallpaper/280/848/HD-wallpaper-video-game-valorant-logo.jpg")',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                minHeight: '100vh' // Adjust the height as needed
                            }}>
                                <div className='d-flex flex-column justify-content-center align-items-center '>
                                    <span className='d-flex '>
                                        <OverlayTrigger placement="top" overlay={
                                            <Tooltip >{selectCard?.displayName}</Tooltip>
                                        }>
                                            <Link className="card-body col-md-4" to={`/trade/agents`}>
                                                <div className="card" style={{ width: '12rem', }}>

                                                    <div className='d-flex align-items-center' style={{ height: type === 'weapons' ? '9rem' : '8rem' }}>
                                                        <img src={selectCard?.displayIcon} className="card-img-top" alt="..." style={{ transition: 'transform 0.3s', width: '100%' }} />
                                                    </div>
                                                    <div className="card-body">
                                                        <h5 style={{ fontWeight: 'bold' }} className="card-title">
                                                            {selectCard?.displayName.length > 0
                                                                ? `${selectCard?.displayName.substring(0, 5)}...`
                                                                : selectCard?.displayName}
                                                        </h5>
                                                        <p style={{ fontWeight: 'bold' }} className="card-text">Points: {selectCard?.point}</p>
                                                    </div>
                                                </div>
                                            </Link>

                                        </OverlayTrigger>
                                    </span>

                                    {userCards?.length > 0 ?
                                        (
                                            <button onClick={() => handleTrade()} style={{ borderColor: 'white', borderWidth: '0.2rem' }} className="btn btn-danger d-flex align-items-center justify-content-center col-md-4 my-3" disabled={selected.length > 0 ? false : true}>
                                                Trade
                                                <svg className='mx-2' xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 512 512"><path fill="currentColor" d="M287.03 20c-39.133.48-79.73 15.297-117 45.938h80.47v43.188c52.76-29.75 114.592-31.588 163.938.03l-18.188 9.72l64.688 50.72l-3.75-83.314l-26.407 14.126C395.99 48.792 345.038 20.644 290.907 20a161.464 161.464 0 0 0-3.875 0zm-268 64.625v212.75h212.782V84.625H19.032zm50.282 26.03H205.78v138.939h-18.718v-120.25H69.313v-18.688zm3.344 38.126l90.094 91.845l-13.344 13.094l-90.094-91.845zm206.656 61.75v212.782h212.75v-212.78h-212.75zm50.25 26.064h136.469V375.5h-18.686V255.28h-117.78l-.002-18.686zm3.344 38.094l90.125 91.875l-13.342 13.062l-90.125-91.844l13.343-13.092zm-278.53 63.656l3.75 83.312l23.312-12.47c60.927 88.637 169.99 106.485 259.625 32.814h-80.439v-43.188c-52.08 29.38-113 31.544-162.03 1.188l20.436-10.938z" /></svg>
                                            </button>
                                        )
                                        :
                                        (
                                            <button onClick={() => handleTrade()} className="btn btn-outline-primary d-flex align-items-center justify-content-center col-md-4 my-3" disabled>
                                                Trade
                                                <svg className='mx-2' xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 512 512"><path fill="currentColor" d="M287.03 20c-39.133.48-79.73 15.297-117 45.938h80.47v43.188c52.76-29.75 114.592-31.588 163.938.03l-18.188 9.72l64.688 50.72l-3.75-83.314l-26.407 14.126C395.99 48.792 345.038 20.644 290.907 20a161.464 161.464 0 0 0-3.875 0zm-268 64.625v212.75h212.782V84.625H19.032zm50.282 26.03H205.78v138.939h-18.718v-120.25H69.313v-18.688zm3.344 38.126l90.094 91.845l-13.344 13.094l-90.094-91.845zm206.656 61.75v212.782h212.75v-212.78h-212.75zm50.25 26.064h136.469V375.5h-18.686V255.28h-117.78l-.002-18.686zm3.344 38.094l90.125 91.875l-13.342 13.062l-90.125-91.844l13.343-13.092zm-278.53 63.656l3.75 83.312l23.312-12.47c60.927 88.637 169.99 106.485 259.625 32.814h-80.439v-43.188c-52.08 29.38-113 31.544-162.03 1.188l20.436-10.938z" /></svg>
                                            </button>
                                        )
                                    }

                                    {userCards?.length > 0 ?
                                        (
                                            <ScrollMenu>
                                                {userCards?.map((item, idx2) => (
                                                    <Card2
                                                        item={item}
                                                        onClick={handleClick(item?.uuid, item)}
                                                        selected={isItemSelected(item?.uuid)}
                                                    />
                                                ))}
                                            </ScrollMenu>
                                        )
                                        :
                                        (
                                            <div className='container mt-3 px-5'>
                                                <p style={{ color: 'red', fontSize: '1.3rem' }}>
                                                    To commence your trading journey, the first step is to sign up. Upon successful registration, you will receive a set of 5 trading cards, which you can leverage for your trading activities.
                                                </p>
                                            </div>
                                        )
                                    }

                                </div>
                            </Modal.Body>
                            <Modal.Footer style={{
                                // backgroundColor: 'black'
                                backgroundImage: 'url("https://w0.peakpx.com/wallpaper/280/848/HD-wallpaper-video-game-valorant-logo.jpg")',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                minHeight: '10vh' // Adjust the height as needed
                            }}>
                                <button onClick={() => setTradeModal(false)} className='btn btn-outline-danger'>
                                    Cancel
                                </button>
                            </Modal.Footer>
                        </Modal>
                    </div >
                )
            }
        </>
    )
}

function Card2({ item, selected, onClick }) {
    const visibility = React.useContext(VisibilityContext);

    return (
        <OverlayTrigger placement="top" overlay={
            <Tooltip >{item?.displayName}</Tooltip>
        }>
            <Link onClick={() => onClick(visibility)}
                className="card-body col-md-4 " to={`/trade/agents`}>
                <div className="card mx-2" style={{ width: '12rem', backgroundSize: 'cover', borderWidth: JSON.stringify(!!selected) === 'true' ? '0.4rem' : '0.3rem', borderColor: JSON.stringify(!!selected) === 'true' ? '#FF4654' : 'white' }}>
                    <div className='d-flex align-items-center' style={{ height: '8rem' }}>
                        <img src={item?.displayIcon} className="card-img-top" alt="..." style={{ transition: 'transform 0.3s', width: '100%' }} />
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">
                            {item?.displayName.length > 0
                                ? `${item?.displayName.substring(0, 5)}...`
                                : item?.displayName}
                        </h5>
                        <p className="card-text">Points: {selected} {item?.point}</p>
                    </div>
                </div>
            </Link>
        </OverlayTrigger>
    );
}
