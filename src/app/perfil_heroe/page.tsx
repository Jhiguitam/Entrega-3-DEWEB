"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './perfil_heroe.module.css';
import buttonStyles from './perfil_heroe_buttons.module.css';
import startStyles from './perfil_heroe_starts.module.css';
import resenaStyles from './perfil_heroe_resenas.module.css';

const PerfilHeroe: React.FC = () => {
    const [heroProfile, setHeroProfile] = useState<any>(null);
    const [heroStats, setHeroStats] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<Array<{ id: string, contenido: string, calificacion: number }>>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 2; // Cambiar a 2 reseñas por página

    // Estados para el formulario de reseñas
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [heroId, setHeroId] = useState<string>(''); // ID del héroe para el pago
    const [targetHeroId, setTargetHeroId] = useState<string>(''); // ID del héroe objetivo para el pago
    const [reviewError, setReviewError] = useState<string | null>(null);
    const [userBalance, setUserBalance] = useState<number>(0);

    // Fetch hero profile including balance
    const fetchHeroProfile = async () => {
        try {
            const response = await fetch('/api/usuario/1');
            if (!response.ok) {
                throw new Error('Error al obtener el perfil del héroe');
            }
            const data = await response.json();
            setHeroProfile(data);
            setHeroId(data.id); // Guardamos la ID del héroe para el pago
            setUserBalance(data.saldo);
        } catch (err) {
            console.error(err);
            setError('Error al obtener el perfil del héroe');
        }
    };

    // Fetch hero stats
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

    // Fetch hero reviews using usuarioId
    const fetchHeroReviews = async () => {
        try {
            const response = await fetch(`/api/resena/${heroId}`); // Asegúrate de que esta sea la ruta correcta
            if (!response.ok) {
                throw new Error('Error al obtener las reseñas del héroe');
            }
            const data = await response.json();
            setReviews(data); // Actualiza el estado de las reseñas
        } catch (err) {
            console.error(err);
            setError('Error al obtener las reseñas del héroe');
        }
    };

    useEffect(() => {
        if (heroId) {
            fetchHeroReviews(); // Llama a obtener reseñas cuando obtienes el perfil
        }
    }, [heroId]);

    useEffect(() => {
        fetchHeroProfile();
        fetchHeroStats();
    }, []);

    const handlePayment = async () => {
        const amountInput = document.getElementById('payment-amount') as HTMLInputElement;
        const amount = Number(amountInput.value);

        if (!targetHeroId || amount <= 0) {
            console.error('ID del héroe o monto inválido');
            return;
        }

        try {
            const response = await fetch('/api/pagos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuarioId: '1', // ID del usuario actual
                    heroeId: targetHeroId, // ID del héroe que se está pagando, ahora editable
                    amount: amount,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al realizar el pago');
            }

            console.log('Pago realizado con éxito:', data);
            // Obtener el saldo actualizado después de un pago exitoso
            await fetchHeroProfile(); // Actualiza el perfil aquí
            amountInput.value = ''; // Limpiar el campo después del pago
        } catch (error) {
            console.error('Error en el pago:', error);
        }
    };

    const validateReview = () => {
        if (!reviewText.trim()) {
            setReviewError('El contenido de la reseña no puede estar vacío.');
            return false;
        }
        if (reviewRating === 0) {
            setReviewError('Debe seleccionar una calificación antes de enviar la reseña.');
            return false;
        }
        return true;
    };

    const handleReviewSubmit = async () => {
        if (!validateReview()) return;

        try {
            const response = await fetch('/api/resena', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuarioId: '1', // ID del usuario actual
                    contenido: reviewText, // Cambia 'text' por 'contenido'
                    calificacion: reviewRating, // Cambia 'rating' por 'calificacion'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al enviar la reseña');
            }

            setReviews([...reviews, data]); // Agrega la nueva reseña al estado actual
            setReviewText('');
            setReviewRating(0);
            setReviewError(null);
        } catch (error) {
            console.error('Error al enviar la reseña:', error);
        }
    };

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    const handleStarClick = (rating: number) => {
        setReviewRating(rating);
    };

    const renderStars = () => {
        return (
            <div className={startStyles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`${startStyles.star} 
                        ${star <= reviewRating ? startStyles.filled : ''} 
                        ${star <= hoverRating ? startStyles.hover : ''}`}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

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
                            </div>
                        </div>
                    ) : (
                        <p>Cargando perfil del héroe...</p>
                    )}
                </div>

                <div className={styles.contenedorCuadro}>
                    <div className="reviews">
                        <h3>Reseñas</h3>
                        {currentReviews.map((review) => (
                            <div key={review.id} className={resenaStyles.reseñaCuadro}>
                                <p className={resenaStyles.reseñaContenido}>Calificación: {review.calificacion}⭐</p>
                                <p className={resenaStyles.reseñaCalificacion}>{review.contenido}</p>
                            </div>
                        ))}
                        <div className={resenaStyles.pagination}>
                        <div className="pagination">
                            {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }, (_, index) => (
                                <button key={index} onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
                            ))}
                        </div>
                        </div>
                    </div>
                </div>

                <div className={styles.contenedorCuadro}>
                    <h3>Deja tu Reseña</h3>
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Escribe tu reseña aquí..."
                    />
                    {reviewError && <p className="error">{reviewError}</p>}
                    {renderStars()}
                    <button className={buttonStyles.enviarResenaButton} onClick={handleReviewSubmit}>
                        Enviar Reseña
                    </button>
                </div>
            </div>

            <div className={styles.rightSide}>
                <div className={styles.contenedorCuadro}>
                    <h3>Realiza un Pago</h3>
                    <input
                        type="text"
                        placeholder="ID del héroe"
                        value={targetHeroId}
                        onChange={(e) => setTargetHeroId(e.target.value)} // Actualizar ID objetivo
                    />
                    <input type="number" id="payment-amount" placeholder="Monto" />
                    <button className={buttonStyles.pagarButton} onClick={handlePayment}>
                        Pagar
                    </button>
                </div>
                <div className={styles.contenedorCuadro}>
                    <h3>Saldo</h3>
                    <p>{userBalance} monedas</p>
                </div>
            </div>
        </div>
    );
};

export default PerfilHeroe;
