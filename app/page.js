'use client'
import Image from "next/image"
import {useState, useEffect} from "react"
import {firestore} from '@/firebase'
import {Box, Modal, Stack, Typography, TextField, Button, Card, CardContent, CardActions, Grid, Container} from '@mui/material'
import { collection, getDocs, query, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore"
import './globals.css';

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else{
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }  

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 4 
      }}
    >
      <Container 
        maxWidth="md" 
        sx={{ 
          bgcolor: '#ffffff', 
          py: 4, 
          borderRadius: '8px', 
          boxShadow: 3 
        }}
      >
        <Typography variant="h4" mb={4} align="center">
          Inventory Management
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} width="100%">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleOpen}
          >
            Add New Item
          </Button>
          <TextField 
            variant="outlined" 
            placeholder="Search items" 
            fullWidth 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            sx={{ ml: 2 }}
          />
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {filteredInventory.map(({ name, quantity }) => (
            <Grid item xs={12} sm={6} md={4} key={name}>
              <Card sx={{ border: '1px solid #ddd', borderRadius: '8px' }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {quantity}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary" 
                    onClick={() => addItem(name)}
                  >
                    Add
                  </Button>
                  <Button 
                    size="small" 
                    color="secondary" 
                    onClick={() => removeItem(name)}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Modal 
          open={open} 
          onClose={handleClose}
        >
          <Box 
            position="absolute" 
            top="50%" 
            left="50%" 
            width={400} 
            bgcolor="background.paper" 
            border="2px solid #000" 
            boxShadow={24} 
            p={4} 
            sx={{ transform: 'translate(-50%, -50%)' }}
          >
            <Typography variant="h6" mb={2}>
              Add Item
            </Typography>
            <Stack 
              direction="row" 
              spacing={2}
            >
              <TextField 
                variant="outlined" 
                fullWidth 
                value={itemName} 
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Container>
    </Box>
  )
}
