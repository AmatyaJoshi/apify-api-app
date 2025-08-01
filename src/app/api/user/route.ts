import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-apify-token');
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    // Fetch user information from Apify API
    const response = await fetch('https://api.apify.com/v2/users/me', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch user information');
    }

    const userData = await response.json();
    
    // Also try to fetch from the account endpoint to see if it has profile pictures
    let accountData = null;
    try {
      const accountResponse = await fetch('https://api.apify.com/v2/users/me/account', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      if (accountResponse.ok) {
        accountData = await accountResponse.json();
        console.log('Account data:', JSON.stringify(accountData.data, null, 2));
      }
    } catch (accountError) {
      console.log('Account endpoint not available or error:', accountError);
    }
    
    // Log the full user data structure for debugging
    console.log('Full user data:', JSON.stringify(userData.data, null, 2));
    console.log('Profile structure:', userData.data.profile);
    console.log('Avatar URL from API:', userData.data.profile?.avatarUrl);
    
      // Check if there's a photo field or other profile picture related fields
      console.log('All profile fields:', Object.keys(userData.data.profile || {}));
      console.log('All user fields:', Object.keys(userData.data || {}));
      console.log('Looking for image fields:', {
        avatarUrl: userData.data.profile?.avatarUrl,
        avatar: userData.data.profile?.avatar,
        photo: userData.data.profile?.photo,
        picture: userData.data.profile?.picture,
        image: userData.data.profile?.image,
        profilePicture: userData.data.profile?.profilePicture,
        profileImage: userData.data.profile?.profileImage,
        githubUsername: userData.data.profile?.githubUsername,
        socialProfiles: userData.data.profile?.socialProfiles
      });    // Use generated avatar with proper initials based on the user's name
    const getAvatarUrl = () => {
      const name = userData.data.profile?.name || userData.data.profile?.displayName || userData.data.username;
      console.log('Using generated avatar for name:', name);
      return `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=3b82f6&textColor=ffffff`;
    };
    
    return NextResponse.json({
      success: true,
      data: {
        id: userData.data.id,
        username: userData.data.username,
        email: userData.data.email,
        profile: {
          name: userData.data.profile?.name || userData.data.profile?.displayName || userData.data.username,
          bio: userData.data.profile?.bio || userData.data.profile?.description || '',
          avatarUrl: getAvatarUrl(),
          website: userData.data.profile?.website || userData.data.profile?.url || '',
        },
        plan: userData.data.plan || 'FREE',
        usage: userData.data.usage || {},
        isEmailVerified: userData.data.isEmailVerified || false,
      }
    });
  } catch (error: any) {
    console.error('Error fetching user information:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user information' },
      { status: 500 }
    );
  }
}
