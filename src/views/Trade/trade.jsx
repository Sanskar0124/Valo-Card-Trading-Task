import React, { useEffect } from 'react'
import { Row, Col, Image, Button, Modal, Form, Card as BootstrapCard, Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function Trade() {
    return (
        <div className='mt-5 pt-5 d-flex justify-content-center'>
            <div className='d-flex flex-wrap '>
                <Link className="card-body mx-4" to={`/trade/agents`}>
                    <div class="card" style={{ width: '18rem' }}>
                        <img src="https://assetsio.reedpopcdn.com/valorant-best-agents.jpg?width=1920&height=1920&fit=bounds&quality=80&format=jpg&auto=webp" class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title">Agents</h5>
                            <p class="card-text">Cards: 23</p>
                        </div>
                    </div>
                </Link>
                <Link className="card-body mx-4" to={`/trade/weapons`}>
                    <div class="card" style={{ width: '18rem' }}>
                        <img src="https://www.valorantpcdownload.com/wp-content/uploads/2022/02/Phantom-Vs-Vandal.png.webp" class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 style={{ color: 'white' }} class="card-title">Weapons</h5>
                            <p style={{ color: 'white' }} class="card-text">Cards: 19</p>
                        </div>
                    </div>
                </Link>
                <Link className="card-body mx-4" to={`/trade/sprays`}>
                    <div class="card" style={{ width: '18rem' }}>
                        <img src="https://staticg.sportskeeda.com/editor/2021/09/9c444-16304999710624.png" class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title">Sprays</h5>
                            <p class="card-text">Cards: 512</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}
