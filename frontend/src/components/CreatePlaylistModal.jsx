import { useState } from "react"

function CreatePlaylistModal({
    open,
    onClose,
    onCreate
}) {
    const [name, setName] = useState("")

    if (!open)
        return null

    function submit(e) {
        e.preventDefault()

        if (!name.trim())
            return

        onCreate(name)
        setName("")
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-spotify-elevated rounded-3xl p-8 w-full max-w-md">
                <h2 className="text-white text-2xl font-bold mb-6">
                    Create Playlist
                </h2>

                <form onSubmit={submit}>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Playlist name"
                        className="w-full bg-spotify-hover text-white px-5 py-4 rounded-xl outline-none mb-6"
                    />

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-full border border-spotify-border text-white"
                        >
                            Cancel
                        </button>

                        <button
                            className="flex-1 py-3 rounded-full bg-spotify-green text-black font-bold"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePlaylistModal