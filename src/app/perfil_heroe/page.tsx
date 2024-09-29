"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './perfil_heroe.module.css'; // Importación de CSS Module
import buttonStyles from './perfil_heroe_buttons.module.css';

const PerfilHeroe: React.FC = () => {
    const [reviews, setReviews] = useState<Array<{ id: number, text: string, rating: number }>>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;

    const heroProfile = { // Todo esto se cambia con la base de datos
        id: '12345',
        name: 'Nombre del Héroe',
        profileType: 'Héroe',
        description: 'Breve descripción del héroe.',
        balance: 1000,
        stats: {
            stars: 4.5,
            requests: 50,
            serviceQuality: 4.8,
            punctuality: 4.9,
        },
        profilePicture: '/images/perfil_heroe/hero_profile.jpg',
    };

    const handlePayment = (amount: number, heroId: string) => {
        console.log(`Pagando ${amount} al héroe con ID ${heroId}`);
    };

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    return (
        <div className={styles.perfilHeroe}>
            {/* Centro de Solicitudes */}
            <div className={styles.leftSide}>
                <div className={styles.contenedorCuadro}>
                    <div className="request-center">
                        <Link href="/centro-de-solicitudes">
                            <button className={buttonStyles.centroSolicitudesButton}>
                                Ir al Centro de Solicitudes
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Perfil del Héroe */}
            <div className={styles.center}>
                <div className={styles.contenedorCuadro}>
                        <div className={styles.profileInfo}>
                            {/* Parte 1: Imagen de perfil */}
                            <div className={styles.profileImage}>
                            <Image
                                src={heroProfile.profilePicture}
                                alt="Foto de perfil"
                                layout="fill" 
                                objectFit="cover" 
                            />
                            </div>
                            {/* Parte 2: Nombre y ID */}
                            <div className={styles.profileData}>
                                <h2>{heroProfile.name}</h2>
                                <p>ID: {heroProfile.id}</p>
                                <p>Tipo de Perfil: {heroProfile.profileType}</p>
                                <p>{heroProfile.description}</p>
                            </div>    
                        </div>
                </div>

                {/* Reseñas */}
                <div className={styles.contenedorCuadro}>
                    <div className="reviews">
                        <h3>Reseñas</h3>
                        {currentReviews.map(review => (
                            <div key={review.id} className="review">
                                <p>{review.text}</p>
                                <p>Calificación: {review.rating} estrellas</p>
                            </div>
                        ))}
                        <div className="pagination">
                            {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }, (_, index) => (
                                <button key={index} onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Estadísticas y Pago */}
            <div className={styles.rightSide}>
                {/* Estadísticas del Héroe */}
                <div className={styles.contenedorCuadro}>
                    <div className="stats">
                        <h3>Estadísticas del Perfil</h3>
                        <p>Número de Estrellas: {heroProfile.stats.stars}</p>
                        <p>Solicitudes Realizadas: {heroProfile.stats.requests}</p>
                        <p>Calidad de Servicio: {heroProfile.stats.serviceQuality}</p>
                        <p>Puntualidad: {heroProfile.stats.punctuality}</p>
                    </div>
                </div>

                {/* Formulario de Pago */}
                <div className={styles.contenedorCuadro}>
                    <div className="payment">
                        <h3>Realizar Pago</h3>
                        <input type="number" placeholder="Valor a pagar" id="payment-amount" />
                        <input type="text" placeholder="ID del Héroe" id="hero-id" />
                        <button
                            className={buttonStyles.pagarButton}
                            onClick={() => handlePayment(
                                Number((document.getElementById('payment-amount') as HTMLInputElement).value),
                                (document.getElementById('hero-id') as HTMLInputElement).value
                            )}
                        >
                            Pagar
                        </button>
                    </div>
                </div>
            </div>
        </div>




    );
};

export default PerfilHeroe;
