// User signup
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await req.supabase.auth.signUpWithPassword({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Create user record in users table
    const { data: userData, error: userError } = await req.supabase
      .from('users')
      .insert([{ id: authData.user.id, email }])
      .select();

    if (userError) {
      console.error('Error creating user record:', userError);
    }

    res.status(201).json({ 
      message: 'Signup successful', 
      user: {
        id: authData.user.id,
        email: authData.user.email
      },
      session: authData.session
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: err.message });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const { data, error } = await req.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ 
      message: 'Login successful', 
      user: {
        id: data.user.id,
        email: data.user.email
      },
      session: data.session
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data, error } = await req.supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    res.status(200).json({ 
      user: {
        id: data.user.id,
        email: data.user.email
      }
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: err.message });
  }
};

// User logout
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      await req.supabase.auth.signOut();
    }

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get user preferences
exports.getPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data, error } = await req.supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(404).json({ error: 'Preferences not found' });
    }

    res.status(200).json(data || {
      user_id: userId,
      name: '',
      location: 'Bengaluru, Karnataka',
      purposes: []
    });
  } catch (err) {
    console.error('Get preferences error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Save user preferences
exports.savePreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, location, purposes } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    if (!name || !location) {
      return res.status(400).json({ 
        error: 'Name and location are required' 
      });
    }

    // Check if preferences exist
    const { data: existing } = await req.supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', userId)
      .single();

    let result;
    if (existing) {
      result = await req.supabase
        .from('user_preferences')
        .update({
          name,
          location,
          purposes: purposes || [],
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select();
    } else {
      result = await req.supabase
        .from('user_preferences')
        .insert([{
          user_id: userId,
          name,
          location,
          purposes: purposes || []
        }])
        .select();
    }

    if (result.error) {
      return res.status(400).json({ error: result.error.message });
    }

    res.status(201).json({ 
      message: 'Preferences saved', 
      data: result.data[0] 
    });
  } catch (err) {
    console.error('Save preferences error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update user preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, location, purposes } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (purposes !== undefined) updateData.purposes = purposes;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await req.supabase
      .from('user_preferences')
      .update(updateData)
      .eq('user_id', userId)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ 
      message: 'Preferences updated', 
      data: data[0] 
    });
  } catch (err) {
    console.error('Update preferences error:', err);
    res.status(500).json({ error: err.message });
  }
};
