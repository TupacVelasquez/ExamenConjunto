import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // <-- IMPORTANTE: Importar toast

// --- ESTILOS CONSTANTES ---
// NOTA: Es mejor mover estas constantes a src/styles/constants.js
const KICK_GREEN = '#00F400';
const DARK_BG = '#1A1A1A';
const LIGHT_BG = '#2C2C2C';
const TEXT_COLOR = '#FFFFFF';

// --- OPCIONES DE ENUMS ---
const API_BASE_URL = 'http://localhost:8080/api/v1/support-tickets'; 
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'CLOSED', 'RESOLVED']; 
const CURRENCY_OPTIONS = ['USD', 'EUR'];

// --- COMPONENTE ---
const TicketForm = ({ onTicketCreated }) => {
    
    // Estado inicial (SE MANTIENE IGUAL)
    const [formData, setFormData] = useState({
        requesterName: '',
        category: '',
        estimatedCost: 0.0,
        currency: CURRENCY_OPTIONS[0],
        priority: PRIORITY_OPTIONS[0],
        dueDate: '', 
        status: STATUS_OPTIONS[0], 
    });
    const [loading, setLoading] = useState(false);
    // [ELIMINADO]: Ya no necesitamos el estado 'message' local

    // Manejadores (SE MANTIENEN IGUAL)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const ticketPayload = {
            ...formData,
            estimatedCost: parseFloat(formData.estimatedCost), 
        };

        try {
            const response = await axios.post(API_BASE_URL, ticketPayload);
            
            // Reemplazo de setMessage por toast.success
            toast.success(`Ticket #${response.data.ticketNumber} creado con éxito!`, {
                position: "top-center" 
            });
            
            onTicketCreated(); 
            
            // Limpia el formulario
            setFormData({
                requesterName: '',
                category: '',
                estimatedCost: 0.0,
                currency: CURRENCY_OPTIONS[0],
                priority: PRIORITY_OPTIONS[0],
                dueDate: '',
                status: STATUS_OPTIONS[0],
            });

        } catch (error) {
            console.error("Error al crear el ticket:", error.response?.data || error);
            const errorDetails = error.response?.data?.details;
            const errorMessage = errorDetails 
                ? Object.values(errorDetails).join('; ') 
                : error.response?.data?.message || 'Error de conexión. CORS o Backend caído.';
            
            // Reemplazo de setMessage por toast.error
            toast.error(`ERROR: ${errorMessage}`, {
                position: "top-center"
            });

        } finally {
            setLoading(false);
        }
    };

    // --- RENDERIZADO CON ESTILOS MEJORADOS ---
    return (
        <div style={{ 
            marginBottom: '30px', 
            padding: '25px', 
            backgroundColor: DARK_BG, 
            borderRadius: '10px',
            color: TEXT_COLOR
        }}>
            <h3 style={{ color: KICK_GREEN, borderBottom: `2px solid ${KICK_GREEN}`, paddingBottom: '10px' }}>
                Crear Nuevo Ticket de Soporte
            </h3>

            <form onSubmit={handleSubmit} style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', // Dos columnas para campos
                gap: '20px',
                marginTop: '20px'
            }}>
                
                {/* GRUPO 1: Información Básica (Fila 1) */}
                <LabelInput 
                    label="Nombre del Solicitante" 
                    type="text"
                    name="requesterName"
                    value={formData.requesterName}
                    onChange={handleChange}
                    required
                />
                <LabelInput 
                    label="Categoría" 
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />

                {/* GRUPO 2: Estado y Prioridad (Fila 2) */}
                <LabelSelect 
                    label="Estado" 
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={STATUS_OPTIONS}
                />
                <LabelSelect 
                    label="Prioridad" 
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    options={PRIORITY_OPTIONS}
                />
                
                {/* GRUPO 3: Costo y Moneda (Fila 3) */}
                <LabelInput 
                    label="Costo Estimado" 
                    type="number"
                    name="estimatedCost"
                    value={formData.estimatedCost}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                />
                <LabelSelect 
                    label="Moneda" 
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    options={CURRENCY_OPTIONS}
                />
                
                {/* GRUPO 4: Fecha Límite (Fila 4) */}
                <div style={{ gridColumn: 'span 2' }}> {/* Ocupa todo el ancho */}
                    <LabelInput 
                        label="Fecha Límite (Due Date)" 
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                {/* BOTÓN DE ENVÍO */}
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        gridColumn: 'span 2', 
                        padding: '15px', 
                        backgroundColor: loading ? '#555' : KICK_GREEN, 
                        color: DARK_BG, 
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1.1em',
                        transition: 'background-color 0.2s'
                    }}
                >
                    {loading ? 'Procesando...' : 'GUARDAR NUEVO TICKET'}
                </button>
                
            </form>
            
            {/* [ELIMINADO]: Ya no se usa el mensaje local */}
            
        </div>
    );
};

export default TicketForm;

// --- COMPONENTES AUXILIARES PARA LIMPIEZA DE CÓDIGO ---
// NOTA: Se mantienen las constantes de color aquí, pero es mejor moverlas a un archivo compartido.

const LabelInput = ({ label, type, ...rest }) => (
    <label style={{ display: 'flex', flexDirection: 'column', color: TEXT_COLOR, fontSize: '0.9em' }}>
        {label}:
        <input
            type={type}
            style={{ 
                padding: '10px', 
                marginTop: '5px',
                backgroundColor: LIGHT_BG,
                color: TEXT_COLOR,
                border: `1px solid ${LIGHT_BG}`,
                borderRadius: '4px'
            }}
            {...rest}
        />
    </label>
);

const LabelSelect = ({ label, options, ...rest }) => (
    <label style={{ display: 'flex', flexDirection: 'column', color: TEXT_COLOR, fontSize: '0.9em' }}>
        {label}:
        <select
            style={{ 
                padding: '10px', 
                marginTop: '5px',
                backgroundColor: LIGHT_BG,
                color: TEXT_COLOR,
                border: `1px solid ${LIGHT_BG}`,
                borderRadius: '4px'
            }}
            {...rest}
        >
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    </label>
);