import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TicketForm from './TicketForm'; 
import { toast } from 'react-toastify'; // <-- IMPORTANTE: Importar toast

// --- ESTILOS CONSTANTES ---
// NOTA: Es ideal mover estas constantes a un archivo compartido como 'src/styles/constants.js'
const KICK_GREEN = '#00F400';
const DARK_BG = '#1A1A1A';
const LIGHT_BG = '#2C2C2C';
const TEXT_COLOR = '#FFFFFF';
const BORDER_COLOR = '#444444'; 

// Opciones de Enums (DEBEN COINCIDIR CON TicketForm.jsx Y EL BACKEND)
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'CLOSED', 'RESOLVED']; 
const CURRENCY_OPTIONS = ['USD', 'EUR']; 

// Asegúrate de que esta URL base coincida con tu backend de Spring Boot
const API_BASE_URL = 'http://localhost:8080/api/v1/support-tickets'; 

// Función auxiliar para formatear la fecha a YYYY-MM-DD
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    // [ELIMINADO]: El estado `error` es manejado por el toast
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    // FUNCIÓN: Obtener Tickets
    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}?page=0&size=10&sort=createdAt,desc`);
            setTickets(response.data.content);
            // Ya no es necesario setError(null);
            
            // Opcional: Mostrar toast si se recargan los datos
            if (!loading) { // Solo mostrar si ya se había cargado la página antes
                toast.info("Lista de tickets actualizada.", { autoClose: 2000 });
            }
            
        } catch (err) {
            console.error("Error al cargar los tickets:", err.response?.data || err);
            // Mostrar toast de error en lugar de cambiar un estado de error
            toast.error("ERROR de conexión: No se pudo cargar la lista de tickets.", { autoClose: false });
        } finally {
            setLoading(false);
        }
    };
    
    // FUNCIÓN: Eliminar Ticket
    const handleDelete = async (id) => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar el ticket con ID ${id}?`)) {
            return;
        }
        setLoading(true);

        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
            
            // Éxito: Mostrar toast
            toast.success(`Ticket #${id} eliminado con éxito.`, { position: "bottom-right" });
            
            // Recargamos la lista después de la eliminación exitosa
            fetchTickets(); 
            
        } catch (error) {
            console.error("Error al eliminar el ticket:", error.response?.data || error);
            const errorMsg = error.response?.data?.message || 'Error desconocido al eliminar.';
            
            // Error: Mostrar toast
            toast.error(`Error al eliminar ticket ${id}: ${errorMsg}`);
        } finally {
             setLoading(false);
        }
    };

    // FUNCIÓN: Iniciar Edición
    const startEditing = (ticket) => {
        setEditingId(ticket.id);
        setEditData({
            ...ticket,
            estimatedCost: ticket.estimatedCost || 0,
            dueDate: formatDate(ticket.dueDate),
        });
    };

    // FUNCIÓN: Manejar cambios en las celdas de edición
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // FUNCIÓN: Guardar Edición (PUT)
    const handleUpdate = async () => {
        setLoading(true);
        const id = editData.id;
        
        const updatePayload = {
            ...editData,
            estimatedCost: parseFloat(editData.estimatedCost),
            ticketNumber: undefined, 
            createdAt: undefined,
            id: undefined,
        };

        try {
            await axios.put(`${API_BASE_URL}/${id}`, updatePayload);
            
            // Éxito: Mostrar toast
            toast.success(`Ticket #${id} actualizado con éxito.`, { position: "bottom-right" });
            
            // Finaliza la edición y recarga la lista
            setEditingId(null);
            fetchTickets(); 
            
        } catch (error) {
            console.error("Error al actualizar el ticket:", error.response?.data || error);
            const errorMsg = error.response?.data?.details 
                ? Object.values(error.response?.data?.details).join('; ') 
                : error.response?.data?.message || 'Error desconocido al actualizar.';
            
            // Error: Mostrar toast
            toast.error(`Error al actualizar ticket ${id}: ${errorMsg}`);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    // El loading y el error ahora se muestran en pantalla globalmente (aunque el loading local es mejor)
    // if (loading) return <div style={{ color: TEXT_COLOR, padding: '20px', backgroundColor: DARK_BG }}>Cargando tickets...</div>;
    // if (error) return <div style={{ color: 'red', padding: '20px', backgroundColor: DARK_BG }}>Error: {error}</div>;


    // --- RENDERIZADO ---
    return (
        <div style={{ padding: '20px', backgroundColor: DARK_BG, minHeight: '100vh', color: TEXT_COLOR }}>
            
            <TicketForm onTicketCreated={fetchTickets} /> 
            
            <h2 style={{ color: KICK_GREEN, borderBottom: `2px solid ${KICK_GREEN}`, paddingBottom: '10px', marginTop: '30px' }}>
                Listado de Tickets ({tickets.length} encontrados)
            </h2>
            
            {/* Mostrar un overlay simple de carga si está activo */}
            {loading && (
                 <div style={{ padding: '10px', backgroundColor: KICK_GREEN, color: DARK_BG, textAlign: 'center', fontWeight: 'bold' }}>
                    Procesando operación...
                </div>
            )}
            
            <div style={{ overflowX: 'auto' }}>
                <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse',
                    marginTop: '20px',
                    backgroundColor: LIGHT_BG,
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}>
                    <thead>
                        {/* INICIO CORRECCIÓN WHITESPACE (USANDO COMENTARIOS) */}
                        <tr style={{ backgroundColor: KICK_GREEN, color: DARK_BG }}>
                            <th style={tableHeaderStyle}>ID</th>{/* Elimina espacio */}
                            <th style={tableHeaderStyle}>N° Ticket</th>{/* Elimina espacio */}
                            <th style={tableHeaderStyle}>Solicitante</th>{/* Elimina espacio */}
                            <th style={tableHeaderStyle}>Categoría</th>{/* Elimina espacio */}
                            <th style={tableHeaderStyle}>Estado</th>{/* Elimina espacio */}
                            <th style={tableHeaderStyle}>Prioridad</th>{/* Elimina espacio */}
                            <th style={tableHeaderStyle}>Costo Est.</th>{/* Elimina espacio */}
                            <th style={tableHeaderStyle}>Moneda</th>{/* Elimina espacio */}
                            <th style={tableHeaderStyle}>Fecha Creación</th>{/* Elimina espacio */}
                            <th style={tableHeaderStyle}>Fecha Límite</th>{/* Elimina espacio */}
                            <th style={tableHeaderStyle}>Acciones</th>
                        </tr>
                        {/* FIN CORRECCIÓN WHITESPACE */}
                    </thead>
                    
                    <tbody>
                        {tickets.length === 0 ? (
                            /* INICIO CORRECCIÓN WHITESPACE */
                            <tr><td colSpan="11" style={tableCellStyle}>No hay tickets registrados.</td></tr>
                            /* FIN CORRECCIÓN WHITESPACE */
                        ) : (
                            tickets.map((ticket, index) => {
                                const isEditing = editingId === ticket.id;
                                const data = isEditing ? editData : ticket;

                                return (
                                    <tr 
                                        key={ticket.id} 
                                        style={{ 
                                            backgroundColor: index % 2 === 0 ? LIGHT_BG : DARK_BG,
                                            borderBottom: `1px solid ${BORDER_COLOR}`,
                                            outline: isEditing ? `2px solid ${KICK_GREEN}` : 'none' 
                                        }}
                                    >
                                        {/* ID y N° Ticket (NO EDITABLES) */}
                                        <td style={tableCellStyle}>{data.id}</td>
                                        <td style={tableCellStyle}>
                                            <strong style={{ color: KICK_GREEN }}>{data.ticketNumber}</strong>
                                        </td>
                                        
                                        {/* Campos Editables */}
                                        <EditableCell 
                                            isEditing={isEditing}
                                            value={data.requesterName}
                                            name="requesterName"
                                            onChange={handleEditChange}
                                            type="text"
                                        />
                                        <EditableCell 
                                            isEditing={isEditing}
                                            value={data.category}
                                            name="category"
                                            onChange={handleEditChange}
                                            type="text"
                                        />
                                        <SelectEditableCell 
                                            isEditing={isEditing}
                                            value={data.status}
                                            name="status"
                                            onChange={handleEditChange}
                                            options={STATUS_OPTIONS}
                                            BadgeComponent={StatusBadge}
                                        />
                                        <SelectEditableCell 
                                            isEditing={isEditing}
                                            value={data.priority}
                                            name="priority"
                                            onChange={handleEditChange}
                                            options={PRIORITY_OPTIONS}
                                            BadgeComponent={PriorityBadge}
                                        />
                                        <EditableCell 
                                            isEditing={isEditing}
                                            value={data.estimatedCost}
                                            name="estimatedCost"
                                            onChange={handleEditChange}
                                            type="number"
                                            step="0.01"
                                        />
                                        <SelectEditableCell 
                                            isEditing={isEditing}
                                            value={data.currency}
                                            name="currency"
                                            onChange={handleEditChange}
                                            options={CURRENCY_OPTIONS}
                                        />
                                        
                                        {/* Fecha Creación (NO EDITABLE) */}
                                        <td style={tableCellStyle}>{formatDate(data.createdAt)}</td>
                                        
                                        {/* Fecha Límite (EDITABLE) */}
                                        <EditableCell 
                                            isEditing={isEditing}
                                            value={data.dueDate}
                                            name="dueDate"
                                            onChange={handleEditChange}
                                            type="date"
                                        />

                                        {/* Columna de Acciones */}
                                        <td style={tableCellStyle}>
                                            {isEditing ? (
                                                <>
                                                    <button 
                                                        onClick={handleUpdate}
                                                        style={{...actionButtonStyle, backgroundColor: KICK_GREEN, color: DARK_BG, marginRight: '5px'}}
                                                        disabled={loading}
                                                    >
                                                        Guardar
                                                    </button>
                                                    <button 
                                                        onClick={() => setEditingId(null)}
                                                        style={{...actionButtonStyle, backgroundColor: '#FF8C00'}}
                                                        disabled={loading}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => startEditing(ticket)}
                                                        style={{...actionButtonStyle, backgroundColor: '#007BFF', marginRight: '5px'}}
                                                        disabled={loading}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(ticket.id)} 
                                                        style={{...actionButtonStyle, backgroundColor: '#DC3545'}}
                                                        disabled={loading}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TicketList;

// --- COMPONENTES AUXILIARES PARA EDICIÓN EN LÍNEA ---
// (Mantenidos sin cambios)

const EditableCell = ({ isEditing, value, name, onChange, type = 'text', step }) => {
    return (
        <td style={tableCellStyle}>
            {isEditing ? (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required
                    step={step}
                    style={inputStyle}
                />
            ) : (
                <span>{value}</span>
            )}
        </td>
    );
};

const SelectEditableCell = ({ isEditing, value, name, onChange, options, BadgeComponent }) => {
    return (
        <td style={tableCellStyle}>
            {isEditing ? (
                <select 
                    name={name} 
                    value={value} 
                    onChange={onChange} 
                    required 
                    style={inputStyle}
                >
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            ) : (
                BadgeComponent ? <BadgeComponent status={value} priority={value} /> : <span>{value}</span>
            )}
        </td>
    );
};


// --- ESTILOS COMPARTIDOS Y COMPONENTES AUXILIARES ---

const tableHeaderStyle = {
    padding: '12px 15px',
    textAlign: 'left',
    fontSize: '0.9em',
};

const tableCellStyle = {
    padding: '10px 15px',
    textAlign: 'left',
    fontSize: '0.9em',
    color: TEXT_COLOR
};

const actionButtonStyle = {
    padding: '6px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: TEXT_COLOR,
    fontWeight: 'bold',
    fontSize: '0.8em'
};

const inputStyle = {
    backgroundColor: DARK_BG,
    color: TEXT_COLOR,
    border: `1px solid ${BORDER_COLOR}`,
    padding: '5px',
    borderRadius: '3px',
    width: '100%',
    boxSizing: 'border-box'
};

// Asigna color basado en el estado
const getStatusColor = (status) => {
    switch (status) {
        case 'OPEN': return '#00BFFF'; 
        case 'IN_PROGRESS': return KICK_GREEN;
        case 'RESOLVED': return '#28A745'; 
        case 'CLOSED': return '#6C757D'; 
        default: return '#FFC107'; 
    }
};

// Asigna color basado en la prioridad
const getPriorityColor = (priority) => {
    switch (priority) {
        case 'CRITICAL': return '#FF0000'; 
        case 'HIGH': return '#FFC107'; 
        case 'MEDIUM': return '#17A2B8'; 
        case 'LOW': return '#5AA15A'; 
        default: return '#FFFFFF';
    }
};

// Badge de Estado
const StatusBadge = ({ status }) => (
    <span style={{
        backgroundColor: getStatusColor(status),
        color: DARK_BG,
        padding: '3px 8px',
        borderRadius: '12px',
        fontSize: '0.75em',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    }}>
        {status}
    </span>
);

// Badge de Prioridad
const PriorityBadge = ({ priority }) => (
    <span style={{
        backgroundColor: getPriorityColor(priority),
        color: TEXT_COLOR,
        padding: '3px 8px',
        borderRadius: '12px',
        fontSize: '0.75em',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    }}>
        {priority}
    </span>
);