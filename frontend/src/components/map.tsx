'use client'

import {MapContainer, TileLayer, useMapEvent} from 'react-leaflet'
import {socket, pinsData} from './socket'
import {Button} from '@/components/ui/button'
import {useCallback, useEffect, useRef, useState} from 'react'
import MarkerItem from './MarkerItem'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import {
    FileUpload,
    FileUploadDropzone,
    FileUploadTrigger,
    FileUploadList,
    FileUploadItem,
    FileUploadItemPreview,
    FileUploadItemMetadata,
    FileUploadItemDelete,
    FileUploadClear,
} from '@/components/ui/file-upload'
import {toast} from 'sonner'
import {Upload, X} from 'lucide-react'

const BACKEND_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000'

type PendingPosition = {
    lat: number
    lng: number
}

function FileUploadComponent({
                                 files,
                                 onFilesChange,
                                 disabled,
                             }: {
    files: File[]
    onFilesChange: (files: File[]) => void
    disabled?: boolean
}) {
    const onFileReject = useCallback((file: File, message: string) => {
        toast(message, {
            description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
        })
    }, [])

    return (
        <FileUpload
            accept="image/*"
            maxFiles={1}
            maxSize={5 * 1024 * 1024}
            className="w-full"
            value={files}
            onValueChange={onFilesChange}
            onFileReject={onFileReject}
            multiple={false}
            disabled={disabled}
        >
            <FileUploadDropzone>
                <div className="flex flex-col items-center gap-1 text-center">
                    <div className="flex items-center justify-center rounded-full border p-2.5">
                        <Upload className="size-6 text-muted-foreground"/>
                    </div>
                    <p className="font-medium text-sm">Drag & drop an image here</p>
                    <p className="text-muted-foreground text-xs">Or click to browse (max 1 image, up to 5MB)</p>
                </div>
                <FileUploadTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2 w-fit" type="button" disabled={disabled}>
                        Browse image
                    </Button>
                </FileUploadTrigger>
            </FileUploadDropzone>
            <FileUploadList>
                {files.map((file, index) => (
                    <FileUploadItem key={index} value={file}>
                        <FileUploadItemPreview/>
                        <FileUploadItemMetadata/>
                        <FileUploadItemDelete asChild>
                            <Button variant="ghost" size="icon" className="size-7" type="button" disabled={disabled}>
                                <X/>
                            </Button>
                        </FileUploadItemDelete>
                    </FileUploadItem>
                ))}
            </FileUploadList>
            {files.length > 0 && (
                <FileUploadClear asChild>
                    <Button variant="outline" size="sm" type="button" disabled={disabled}>
                        Clear image
                    </Button>
                </FileUploadClear>
            )}
        </FileUpload>
    )
}

export default function SightingsMap() {
    const [isConnected, setIsConnected] = useState(socket.connected)
    const [pins, setPins] = useState(new Map())
    const [showDisconnected, setShowDisconnected] = useState(false)
    const [showReconnected, setShowReconnected] = useState(false)
    const [makePin, setMakePin] = useState(false)
    const [pendingPosition, setPendingPosition] = useState<PendingPosition | null>(null)
    const [animalName, setAnimalName] = useState('')
    const [details, setDetails] = useState('')
    const [files, setFiles] = useState<File[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const hasConnectedOnce = useRef(false)
    const disconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        function onConnect() {
            setIsConnected(true)

            if (disconnectTimer.current) {
                clearTimeout(disconnectTimer.current)
                disconnectTimer.current = null
            }
            setShowDisconnected(false)

            if (hasConnectedOnce.current) {
                setShowReconnected(true)
                setTimeout(() => setShowReconnected(false), 3000)
            }
            hasConnectedOnce.current = true
        }

        function onDisconnect() {
            setIsConnected(false)

            disconnectTimer.current = setTimeout(() => {
                setShowDisconnected(true)
            }, 3000)
        }

        function onInit(value: unknown) {
            setPins(new Map(value as Iterable<readonly [unknown, unknown]>))
        }

        socket.on('connect', onConnect)
        socket.on('disconnect', onDisconnect)
        socket.on('init', onInit)

        if (pinsData) {
            setPins(new Map(pinsData))
        }

        return () => {
            socket.off('connect', onConnect)
            socket.off('disconnect', onDisconnect)
            socket.off('init', onInit)
            if (disconnectTimer.current) {
                clearTimeout(disconnectTimer.current)
            }
        }
    }, [])

    const resetForm = useCallback(() => {
        setAnimalName('')
        setDetails('')
        setFiles([])
        setPendingPosition(null)
    }, [])

    function ClickHandler() {
        useMapEvent('click', (e) => {
            if (makePin) {
                return
            }

            setPendingPosition({lat: e.latlng.lat, lng: e.latlng.lng})
            setMakePin(true)
        })

        return null
    }

    const handleSubmit = useCallback(
        async (event) => {
            if (!pendingPosition) {
                toast.error('Missing map position. Click the map again to report a sighting.')
                return
            }

            if (animalName.trim().length === 0) {
                toast.error('Animal name is required.')
                return
            }

            setIsSubmitting(true)

            try {
                const formData = new FormData()
                formData.append('animalName', animalName.trim())
                formData.append('details', details.trim())
                formData.append('lat', String(pendingPosition.lat))
                formData.append('lng', String(pendingPosition.lng))
                formData.append('image', JSON.stringify(files))

                const response = await fetch(`${BACKEND_URL}/api/pins`, {
                    method: 'POST',
                    body: formData,
                })

                if (!response.ok) {
                    const errorText = await response.text()
                    throw new Error(errorText || 'Failed to submit report')
                }

                toast.success('Sighting submitted.')
                setMakePin(false)
                resetForm()
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to submit report'
                toast.error(message)
            } finally {
                setIsSubmitting(false)
            }
        },
        [animalName, details, files, pendingPosition, resetForm],
    )

    return (
        <div className="relative h-full">
            {showDisconnected && (
                <div
                    className="absolute top-0 left-0 right-0 z-999 text-center py-4 text-red-500 bg-red-100/90 backdrop-blur-sm">
                    ⚠️ Not connected to server - sightings may not be up to date.
                </div>
            )}
            {showReconnected && (
                <div
                    className="absolute top-0 left-0 right-0 z-999 text-center py-4 text-emerald-600 bg-emerald-100/90 backdrop-blur-sm">
                    ✅ Reconnected to server!
                </div>
            )}
            <Dialog
                open={makePin}
                onOpenChange={(open) => {
                    setMakePin(open)
                    if (!open && !isSubmitting) {
                        resetForm()
                    }
                }}
            >
                <DialogContent className="z-10000" showCloseButton={!isSubmitting}>
                    <DialogHeader>
                        <DialogTitle>Report a Sighting</DialogTitle>
                        <DialogDescription>Create a report for animal sightings.</DialogDescription>
                    </DialogHeader>
                    <form className="grid auto-rows-min gap-6" onSubmit={handleSubmit}>
                        <div className="grid gap-3">
                            <Label htmlFor="animal-name">Animal Name</Label>
                            <Input
                                id="animal-name"
                                value={animalName}
                                onChange={(event) => setAnimalName(event.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="details">Details (Optional)</Label>
                            <Input
                                id="details"
                                value={details}
                                onChange={(event) => setDetails(event.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="picture">Upload a Picture</Label>
                            <FileUploadComponent files={files} onFilesChange={setFiles} disabled={isSubmitting}/>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setMakePin(false)
                                    resetForm()
                                }}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting || !pendingPosition || !isConnected}>
                                {isSubmitting ? 'Submitting...' : 'Submit Report'}
                            </Button>
                        </DialogFooter>
                        {!isConnected && (
                            <p className="text-sm text-red-500">Reconnect to the server before submitting a report.</p>
                        )}
                    </form>
                </DialogContent>
            </Dialog>
            <MapContainer center={[47.6, -122.25]} zoom={12} scrollWheelZoom className="h-full z-0">
                <ClickHandler/>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {[...pins.entries()].map(([id, pin]) => (
                    <MarkerItem key={String(id)} pin={pin}/>
                ))}
            </MapContainer>
        </div>
    )
}
