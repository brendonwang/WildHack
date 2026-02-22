declare module 'leaflet' {
    export type LatLngExpression = [number, number] | number[]
    export type LatLngBoundsExpression = unknown
    export type FitBoundsOptions = unknown

    export interface MapOptions {
        center?: LatLngExpression
        zoom?: number
        scrollWheelZoom?: boolean
    }

    export interface TileLayerOptions {
        attribution?: string
    }

    export interface MarkerOptions {
        icon?: unknown
    }

    export class Map {}
    export class TileLayer {}
    export class Marker<T = unknown> {}

    export function icon(options: {
        iconRetinaUrl?: string
        iconUrl?: string
        shadowUrl?: string
        iconSize?: [number, number]
        iconAnchor?: [number, number]
        popupAnchor?: [number, number]
        shadowSize?: [number, number]
    }): unknown

    const L: {
        icon: typeof icon
    }

    export default L
}
