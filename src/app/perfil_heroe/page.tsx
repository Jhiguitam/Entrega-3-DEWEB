"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './perfil_heroe.module.css';
import buttonStyles from './perfil_heroe_buttons.module.css';

const PerfilHeroe: React.FC = () => {
    const [heroProfile, setHeroProfile] = useState<any>(null);
    const [heroStats, setHeroStats] = useState<any>(null); // Estado para las estadísticas
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<Array<{ id: number, text: string, rating: number }>>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;

    // Fetch del perfil del héroe
    const fetchHeroProfile = async () => {
        try {
            const response = await fetch('/api/usuario/1');
            if (!response.ok) {
                throw new Error('Error al obtener el perfil del héroe');
            }
            const data = await response.json();
            setHeroProfile(data);
        } catch (err) {
            console.error(err);
            setError('Error al obtener el perfil del héroe');
        }
    };

    // Fetch de las estadísticas del héroe
    const fetchHeroStats = async () => {
        try {
            const response = await fetch('/api/estadisticas/1');
            if (!response.ok) {
                throw new Error('Error al obtener las estadísticas del héroe');
            }
            const data = await response.json();
            setHeroStats(data);
        } catch (err) {
            console.error(err);
            setError('Error al obtener las estadísticas del héroe');
        }
    };

    useEffect(() => {
        fetchHeroProfile();
        fetchHeroStats(); // Llamada a la API de estadísticas
    }, []);

    // Función de pago de héroes
    const handlePayment = async (amount: number, heroId: string) => {
        try {
            const response = await fetch('/api/pagos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuarioId: '1', // ID del usuario actual
                    heroeId: heroId,
                    amount: amount,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al realizar el pago');
            }

            console.log('Pago realizado con éxito:', data);
        } catch (error) {
            console.error('Error en el pago:', error);
        }
    };

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    return (
        <div className={styles.perfilHeroe}>
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

            <div className={styles.center}>
                <div className={styles.contenedorCuadro}>
                    {error && <p className="error">{error}</p>}
                    {heroProfile ? (
                        <div className={styles.profileInfo}>
                            <div className={styles.profileImage}>
                                <Image
                                    src={heroProfile.fotoPerfil}
                                    alt="Foto de perfil"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <div className={styles.profileData}>
                                <h2>{heroProfile.nombre}</h2>
                                <p>ID: {heroProfile.id}</p>
                                <p>Tipo de Perfil: {heroProfile.rol}</p>
                                <p>{heroProfile.descripcion}</p>
                                <p>Saldo: {heroProfile.saldo}</p>
                            </div>
                        </div>
                    ) : (
                        <p>Cargando perfil del héroe...</p>
                    )}
                </div>

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

            <div className={styles.rightSide}>
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

                {/* Estadísticas del Héroe */}
                {heroStats ? (
                    <div className={styles.contenedorCuadro}>
                        <div className="stats">
                            <h3>Estadísticas del Perfil</h3>
                            <p>Número de Estrellas: {heroStats.estrellas}</p>
                            <p>Solicitudes Realizadas: {heroStats.solicitudes}</p>
                            <p>Calidad de Servicio: {heroStats.calidadServicio}</p>
                            <p>Puntualidad: {heroStats.puntualidad}</p>
                        </div>
                    </div>
                ) : (
                    <p>Cargando estadísticas del héroe...</p>
                )}
            </div>
        </div>
    );
};

export default PerfilHeroe;
