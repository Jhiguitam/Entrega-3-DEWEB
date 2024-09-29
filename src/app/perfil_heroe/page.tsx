"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './perfil_heroe.module.css';
import buttonStyles from './perfil_heroe_buttons.module.css';
import startStyles from './perfil_heroe_starts.module.css';

const PerfilHeroe: React.FC = () => {
    const [heroProfile, setHeroProfile] = useState<any>(null);
    const [heroStats, setHeroStats] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<Array<{ id: string; contenido: string; calificacion: number }>>([]); // Ajuste de tipo
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;

    // Estados para el formulario de reseñas
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(0); // Para manejar la calificación seleccionada
    const [hoverRating, setHoverRating] = useState(0); // Para mostrar las estrellas al pasar el ratón
    const [heroId, setHeroId] = useState<string>(''); // ID del héroe para la reseña
    const [reviewError, setReviewError] = useState<string | null>(null); // Estado para los errores de la reseña

    // Fetch del perfil del héroe
    const fetchHeroProfile = async () => {
        try {
            const response = await fetch('/api/usuario/1');
            if (!response.ok) {
                throw new Error('Error al obtener el perfil del héroe');
            }
            const data = await response.json();
            setHeroProfile(data);
            setHeroId(data.id); // Guardar el ID del héroe para las reseñas
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

    // Fetch de las reseñas del héroe
    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/resena?heroeId=${heroId}`); // Ajustar la URL para obtener reseñas por héroe
            if (!response.ok) {
                throw new Error('Error al obtener las reseñas');
            }
            const data = await response.json();
            setReviews(data);
        } catch (err) {
            console.error(err);
            setError('Error al obtener las reseñas');
        }
    };

    useEffect(() => {
        fetchHeroProfile();
        fetchHeroStats();
    }, []);

    useEffect(() => {
        if (heroId) {
            fetchReviews(); // Fetch reseñas cuando se obtiene el ID del héroe
        }
    }, [heroId]);

    // Función para manejar el pago
    const handlePayment = async (amount: number, heroId: string) => {
        try {
            const response = await fetch('/api/pagos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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

    // Validación para asegurarse de que la reseña no esté vacía
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

    // Función para manejar la creación de reseñas
    const handleReviewSubmit = async () => {
        if (!validateReview()) return; // Si la validación falla, no se envía la reseña

        try {
            const response = await fetch('/api/resena', { // Cambiar la URL a la correcta
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuarioId: '1', // ID del usuario actual (cambiar según autenticación)
                    contenido: reviewText, // Usar contenido en lugar de text
                    calificacion: reviewRating, // Usar calificacion en lugar de rating
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al enviar la reseña');
            }

            // Actualizar las reseñas después de agregar una nueva
            setReviews([...reviews, data]);
            setReviewText(''); // Limpiar el texto de la reseña
            setReviewRating(0); // Reiniciar la calificación
            setReviewError(null); // Limpiar errores si los hubo
        } catch (error) {
            console.error('Error al enviar la reseña:', error);
        }
    };

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    // Función para manejar la calificación en estrellas
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
                        ${star <= hoverRating ? startStyles.hover : ''}`} // Clase para el hover
                        onClick={() => handleStarClick(star)} // Guardar la calificación al hacer clic
                        onMouseEnter={() => setHoverRating(star)} // Cambia el estado al pasar el ratón
                        onMouseLeave={() => setHoverRating(0)} // Resetea el estado al dejar de pasar el ratón
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
                                <p>Saldo: {heroProfile.saldo}</p>
                            </div>
                        </div>
                    ) : (
                        <p>Cargando perfil del héroe...</p>
                    )}
                </div>

                {/* Sección de reseñas */}
                <div className={styles.contenedorCuadro}>
                    <div className="reviews">
                        <h3>Reseñas</h3>
                        {currentReviews.map(review => (
                            <div key={review.id} className="review">
                                <p>{review.contenido}</p> {/* Cambiar 'text' por 'contenido' */}
                                <p>Calificación: {review.calificacion} estrellas</p> {/* Cambiar 'rating' por 'calificacion' */}
                            </div>
                        ))}
                        <div className="pagination">
                            {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }, (_, index) => (
                                <button key={index} onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Formulario para crear una nueva reseña */}
                <div className={styles.contenedorCuadro}>
                    <h3>Deja tu Reseña</h3>
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Escribe tu reseña"
                    />
                    {/* Calificación con estrellas */}
                    {renderStars()}
                    {reviewError && <p className={styles.error}>{reviewError}</p>}
                    <button
                        className={buttonStyles.pagarButton}
                        onClick={handleReviewSubmit}
                    >
                        Enviar Reseña
                    </button>
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

                {/* Estadísticas del héroe */}
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
