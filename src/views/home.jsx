import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Image, Button, Modal, Form, Card as BootstrapCard, Dropdown, Offcanvas, Tooltip, OverlayTrigger } from 'react-bootstrap'
import ApiRequest from '../api-call/apiRequest'
import { useNavigate } from 'react-router-dom';
import LoaderComp from '../components/LoaderComp';

export default function Home() {
    const [Cards, setCards] = useState(JSON.parse(localStorage.getItem('cards')))
    const [isLoading, setIsLoading] = useState(false)
    return (
        <>
            {isLoading ?
                (
                    <div className='d-flex align-items-center justify-content-center my-5 py-5'>
                        <LoaderComp />
                    </div>
                )
                :
                (
                    <div className='d-flex flex-column align-items-center mt-4'>
                        {Cards?.length > 0 ?
                            (
                                <>
                                    <h3 className='mb-4' style={{ color: '#FF4654' }}>Your Cards</h3>
                                    <div className='d-flex flex-wrap'>
                                        {Cards?.map((item, idx) => (
                                            <OverlayTrigger placement="top" overlay={
                                                <Tooltip >{item?.displayName}</Tooltip>
                                            }>
                                                <Link className="card-body " to={`/trade/${item?.type}`}>
                                                    <div className="card" style={{ width: '13rem' }}>
                                                        <div className='d-flex align-items-center' style={{ height: '15rem' }}>
                                                            <img src={item?.displayIcon} class="card-img-top" alt="..." style={{ transition: 'transform 0.3s', width: '100%' }} />
                                                        </div>
                                                        <div className='mt-3'>
                                                            <h5 className="card-title">
                                                                {item?.displayName.length > 12
                                                                    ? `${item?.displayName.substring(0, 8)}...`
                                                                    : item?.displayName}
                                                            </h5>
                                                            <p className="card-text">Points: {item?.point}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </OverlayTrigger>

                                        )
                                        )}
                                    </div>
                                </>
                            )
                            :
                            (
                                <div className='container'>
                                    <h4 style={{ color: '#FF4654' }} className='mb-5 pb-5'>Welcome to Valo Cards Trading</h4>
                                    <p className='' style={{ color: '#FF4654', fontSize: '1.3rem', marginTop: '25rem' }}>
                                        To commence your trading journey, the first step is to sign up. Upon successful registration, you will receive a set of 5 trading cards, which you can leverage for your trading activities.
                                    </p>
                                </div>
                            )
                        }


                    </div>
                )
            }
        </>
    )
}
